import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
] as const) {
  test(`header switcher accessible name stays complete at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/communities");

    const switcher = page.getByRole("button", { name: "Choose community" });
    await expect(switcher).toBeVisible();
    const box = await switcher.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(120);

    const clipped = await switcher.evaluate((el) => {
      const text = el.querySelector("span");
      if (!text) return true;
      return text.scrollWidth > text.clientWidth + 1;
    });
    expect(clipped).toBe(false);

    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", {
        name: "Legacy collection",
      }),
    ).toBeVisible();
  });
}
