import assert from "node:assert/strict";
import test from "node:test";
import {
  getMacauDrawDateFromIssue,
  getYearZodiac,
  getZodiacForDrawDate,
  getZodiacForNumber,
  getZodiacYearForDate,
  inferZodiacYearFromIssue,
} from "@/lib/marksix";

test("the number 01 zodiac follows the traditional yearly sequence", () => {
  assert.equal(getYearZodiac(2022), "虎");
  assert.equal(getYearZodiac(2023), "兔");
  assert.equal(getYearZodiac(2024), "龙");
  assert.equal(getYearZodiac(2025), "蛇");
  assert.equal(getYearZodiac(2026), "马");

  assert.equal(getZodiacForNumber(1, 2024), "龙");
  assert.equal(getZodiacForNumber(1, 2025), "蛇");
  assert.equal(getZodiacForNumber(1, 2026), "马");
});

test("the zodiac axis switches on the Lunar New Year evening draw in Macau", () => {
  const before2025 = new Date("2025-01-28T13:32:32.000Z");
  const newYear2025 = new Date("2025-01-29T13:32:32.000Z");
  const before2026 = new Date("2026-02-16T13:32:32.000Z");
  const newYear2026 = new Date("2026-02-17T13:32:32.000Z");

  assert.equal(getZodiacYearForDate(before2025), 2024);
  assert.equal(getZodiacYearForDate(newYear2025), 2025);
  assert.equal(getZodiacYearForDate(before2026), 2025);
  assert.equal(getZodiacYearForDate(newYear2026), 2026);

  assert.equal(getZodiacForDrawDate(40, before2025), "牛");
  assert.equal(getZodiacForDrawDate(13, newYear2025), "蛇");
  assert.equal(getZodiacForDrawDate(39, before2026), "兔");
  assert.equal(getZodiacForDrawDate(24, newYear2026), "羊");
});

test("New Macau YYYYNNN issues resolve to the correct draw day and zodiac year", () => {
  assert.equal(getMacauDrawDateFromIssue("2025028")?.toISOString(), "2025-01-28T13:00:00.000Z");
  assert.equal(getMacauDrawDateFromIssue("2025029")?.toISOString(), "2025-01-29T13:00:00.000Z");
  assert.equal(inferZodiacYearFromIssue("2025028"), 2024);
  assert.equal(inferZodiacYearFromIssue("2025029"), 2025);
  assert.equal(inferZodiacYearFromIssue("2026047"), 2025);
  assert.equal(inferZodiacYearFromIssue("2026048"), 2026);

  assert.equal(getMacauDrawDateFromIssue("2026000"), null);
  assert.equal(getMacauDrawDateFromIssue("2026366"), null);
  assert.ok(getMacauDrawDateFromIssue("2024366"));
});

test("the current New Macau special number 20 is pig on the 2026 horse axis", () => {
  const drawDate = new Date("2026-08-19T13:32:32.000Z");
  assert.equal(getZodiacForDrawDate(20, drawDate), "猪");
});
