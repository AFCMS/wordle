/// <reference types="vite/client" />

// SPDX-FileCopyrightText: 2024 AFCMS <afcm.contact@gmail.com>
// SPDX-License-Identifier: GPL-3.0-or-later

interface ImportMetaEnv {
	readonly VITE_WORD_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
