// SPDX-FileCopyrightText: 2024 AFCMS <afcm.contact@gmail.com>
// SPDX-License-Identifier: GPL-3.0-or-later

import { defineConfig } from "vite";
import { preact } from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import sri from "vite-plugin-sri-gen";

export default defineConfig({
    plugins: [
        tailwindcss(),
        preact(),
        sri({
            algorithm: "sha512",
            crossorigin: "anonymous",
            fetchCache: true,
            fetchTimeoutMs: 5000,
            skipResources: [],
            verboseLogging: false,
        }),
    ],
});
