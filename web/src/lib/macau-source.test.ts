import assert from "node:assert/strict";
import test from "node:test";
import { loadMacauRecords, parseMacauPayload } from "@/lib/macau-source";

test("New Macau payload keeps six main numbers and the seventh number as special", () => {
  const records = parseMacauPayload([
    {
      expect: "2026231",
      openTime: "2026-08-19 21:32:32",
      openCode: "39,46,23,11,08,13,20",
      zodiac: "龍,雞,猴,猴,豬,馬,豬",
    },
  ], "new_macau_latest_api");

  assert.equal(records.length, 1);
  assert.equal(records[0].issueNo, "2026231");
  assert.equal(records[0].drawDate.toISOString(), "2026-08-19T13:32:32.000Z");
  assert.deepEqual(records[0].numbers, [39, 46, 23, 11, 8, 13]);
  assert.equal(records[0].specialNumber, 20);
  assert.equal(records[0].source, "new_macau_latest_api");
});

test("New Macau history object payloads and malformed rows are handled safely", () => {
  const records = parseMacauPayload({
    data: [
      {
        expect: "2025029",
        openTime: "2025-01-29 21:32:32",
        openCode: "14,46,03,35,43,10,13",
      },
      {
        expect: "2025030",
        openTime: "2025-01-30 21:32:32",
        openCode: "01,01,02,03,04,05,06",
      },
      {
        expect: "not-new-macau",
        openTime: "2025-01-31 21:32:32",
        openCode: "01,02,03,04,05,06,07",
      },
      {
        expect: "2023004",
        openTime: "2024-01-04 21:32:32",
        openCode: "39,36,28,49,12,24,40",
      },
    ],
  }, "new_macau_history_api");

  assert.equal(records.length, 1);
  assert.equal(records[0].issueNo, "2025029");
  assert.equal(records[0].specialNumber, 13);
});

test("configuration cannot silently switch to the old Macau lottery key", async () => {
  const previousKey = process.env.MACAU_LOTTERY_KEY;
  process.env.MACAU_LOTTERY_KEY = "macaujc";

  try {
    await assert.rejects(loadMacauRecords(), /must be macaujc2/);
  } finally {
    if (previousKey === undefined) {
      delete process.env.MACAU_LOTTERY_KEY;
    } else {
      process.env.MACAU_LOTTERY_KEY = previousKey;
    }
  }
});
