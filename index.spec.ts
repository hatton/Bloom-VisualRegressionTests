import { spawn } from "child_process";
import fetch from "node-fetch";
import { test, expect } from "vitest";

test("foo", async () => {
    await launchBloomIfNeeded();

    const r = await fetch("http://localhost:8089/bloom/api/collections/list");
    expect(r.ok).toBe(true);
    const collections = await r.json();
    expect(collections).toEqual([]);
});

async function isBloomRunning() {
    try {
        const r = await fetch("http://localhost:8089/bloom/testconnection");
        return r.ok;
    } catch (e) {
        return false;
    }
}
async function launchBloomIfNeeded() {
    if (await isBloomRunning()) {
        return;
    }
    spawn("../../output/Debug/Bloom.exe");

    const startTime = Date.now();
    while (Date.now() - startTime < 5000) {
        if (await isBloomRunning()) {
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    expect(false, "Bloom did not start").toBe(true);
}
