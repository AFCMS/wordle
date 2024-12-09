// SPDX-FileCopyrightText: 2024 AFCMS <afcm.contact@gmail.com>
// SPDX-License-Identifier: GPL-3.0-or-later

import { render } from "preact";
import { Analytics } from "@vercel/analytics/react";

import "./index.css";
import App from "./App";

render(<>
	<Analytics />
	<App />
</>, document.getElementById("root") as HTMLElement);