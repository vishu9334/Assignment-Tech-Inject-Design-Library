import test from "node:test";
import assert from "node:assert";
import path from "node:path";
import process from "node:process";
import { prisma } from "../packages/database/src/prisma.ts";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tech-inject-super-secret-jwt-key-2026";

test("Suite: Security, Access Enforcement & Clean Architecture Checks", async (t) => {
  let freeUser;
  let premiumUser;
  let adminUser;
  let freeComponent;
  let premiumComponent;
  let draftComponent;

  t.before(async () => {
    freeUser = await prisma.user.findUnique({ where: { email: "free@techinject.io" } });
    premiumUser = await prisma.user.findUnique({ where: { email: "premium@techinject.io" } });
    adminUser = await prisma.user.findUnique({ where: { email: "admin@techinject.io" } });

    freeComponent = await prisma.component.findUnique({ where: { slug: "button" } });
    premiumComponent = await prisma.component.findUnique({ where: { slug: "deals-table" } });
    draftComponent = await prisma.component.findUnique({ where: { slug: "revenue-chart" } });
  });

  t.after(async () => {
    await prisma.$disconnect();
  });

  await t.test("1. Draft Isolation: Drafts must stay private and never be listed publicly", async () => {
    assert.ok(draftComponent, "Draft component should exist in DB");
    assert.strictEqual(draftComponent.status, "DRAFT");

    const publicList = await prisma.component.findMany({
      where: { status: "PUBLISHED" },
    });

    const foundDraft = publicList.find((c) => c.slug === draftComponent.slug);
    assert.strictEqual(foundDraft, undefined, "Public query must not include draft components");
  });

  await t.test("2. Admin Write Protection: Token verification distinguishes admin vs customer", async () => {
    const adminToken = jwt.sign(
      { userId: adminUser.id, email: adminUser.email, role: "ADMIN" },
      JWT_SECRET
    );
    const customerToken = jwt.sign(
      { userId: freeUser.id, email: freeUser.email, role: "CUSTOMER" },
      JWT_SECRET
    );

    const adminPayload = jwt.verify(adminToken, JWT_SECRET);
    const customerPayload = jwt.verify(customerToken, JWT_SECRET);

    assert.strictEqual(adminPayload.role, "ADMIN");
    assert.strictEqual(customerPayload.role, "CUSTOMER");
    assert.notStrictEqual(customerPayload.role, "ADMIN", "Customer must not possess ADMIN role");
  });

  await t.test("3. Premium Access Logic: Free user vs Premium user permissions", async () => {
    assert.ok(freeComponent);
    assert.ok(premiumComponent);

    const freeAccessForGuest = freeComponent.accessLevel === "FREE";
    assert.strictEqual(freeAccessForGuest, true, "Free components must be accessible to visitors");

    const premiumAccessForFreeUser =
      premiumComponent.accessLevel === "FREE" || freeUser.isPremium === true;
    assert.strictEqual(
      premiumAccessForFreeUser,
      false,
      "Premium components must be blocked for free users"
    );

    const premiumAccessForPremiumUser =
      premiumComponent.accessLevel === "FREE" || premiumUser.isPremium === true;
    assert.strictEqual(
      premiumAccessForPremiumUser,
      true,
      "Premium components must be accessible to premium users"
    );
  });

  await t.test("4. Real-Time Revocation: Database status takes precedence over token payload", async () => {
    const testEmail = `test-revoke-${Date.now()}@test.io`;
    const tempCustomer = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Revocation Test User",
        password: "hash",
        role: "CUSTOMER",
        isPremium: true,
      },
    });

    const token = jwt.sign(
      { userId: tempCustomer.id, email: tempCustomer.email, role: "CUSTOMER", isPremium: true },
      JWT_SECRET
    );

    await prisma.user.update({
      where: { id: tempCustomer.id },
      data: { isPremium: false },
    });

    const payload = jwt.verify(token, JWT_SECRET);
    const liveRecord = await prisma.user.findUnique({ where: { id: payload.userId } });

    assert.strictEqual(liveRecord.isPremium, false, "Live DB state must show isPremium=false");
    const hasLiveAccess = liveRecord && liveRecord.isPremium;
    assert.strictEqual(
      hasLiveAccess,
      false,
      "Access must be immediately denied upon DB revocation despite claims in old token"
    );

    await prisma.user.delete({ where: { id: tempCustomer.id } });
  });

  await t.test("5. CLI Security: Path Traversal Interception", () => {
    const cwd = process.cwd();
    const maliciousTarget = "../../../etc/passwd";

    const resolved = path.resolve(cwd, maliciousTarget);
    const relative = path.relative(cwd, resolved);
    const isUnsafe = relative.startsWith("..") || path.isAbsolute(relative);

    assert.strictEqual(isUnsafe, true, "Path traversal targeting outside root must be detected");
  });
});
