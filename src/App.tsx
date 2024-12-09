// SPDX-FileCopyrightText: 2024 AFCMS <afcm.contact@gmail.com>
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "preact/hooks";
import Box from "./components/Box";

/**
 * @param curent_word The word to guess, used to determine the color of the letters
 * @param row The 5 letter string of the line
 * @param id Used to give boxes a unique key
 */
function build_row(
	curent_word: string | undefined,
	row: string,
	id: number
): Array<JSX.Element> {
	const out = [];

	if (row === undefined) {
		for (let i = 0; i < 5; i++) {
			const box_id = i + 5 * id;
			out.push(<Box letter=" " key={box_id} />);
		}
	} else {
		for (let i = 0; i < 5; i++) {
			const box_id = i + 5 * id;
			if (row[i] === undefined) {
				out.push(<Box letter=" " key={box_id} />);
			} else {
				const char = row[i].toUpperCase();
				const char_c =
					curent_word === undefined ? "" : curent_word[i].toUpperCase();

				if (char === char_c) {
					out.push(<Box letter={char} key={box_id} t="right" />);
				} else {
					if (curent_word === undefined ? false : curent_word.match(row[i])) {
						out.push(<Box letter={char} key={box_id} t="wplaced" />);
					} else {
						out.push(<Box letter={char} key={box_id} t="wrong" />);
					}
				}
			}
		}
	}
	return out;
}

function App() {
	const [curentWord, setCurentWord] = useState<string | undefined>(undefined);

	const [newWord, setNewWord] = useState(false);

	const [rows, setRows] = useState<string[]>([]);

	const [input, setInput] = useState("");

	const [win, setWin] = useState(false);

	function hasWon(): boolean {
		return win;
	}

	function hasLost(): boolean {
		return !win && rows.length === 5;
	}

	useEffect(() => {
		if (newWord || curentWord === undefined) {
			fetch(import.meta.env.VITE_WORD_API_URL)
				.then((r) => r.json() as Promise<string[]>)
				.then((r) => setCurentWord(r[0]));
			setNewWord(false);
		}
	}, [newWord]);

	function push_rows() {
		if (!hasWon() && !hasLost() && input.length === 5) {
			const r = rows;
			r.push(input);
			setRows(r);
			if (input === curentWord) {
				setWin(true);
			}
			setInput("");
		}
	}

	function reset_game() {
		setWin(false);
		setInput("");
		setRows([]);
		setNewWord(true);
	}

	return (
		<div className="App">
			<div className="flex items-center justify-center p-6">
				<div className="flex w-max flex-col rounded-sm border border-slate-600 p-4 shadow-sm">

					<div className="flex justify-between w-full">
						<button
							className="h-10 w-10 rounded-sm border border-slate-600 bg-slate-200 text-black transition-colors hover:bg-slate-400 disabled:bg-slate-300 dark:border-0 dark:bg-gray-800 dark:text-slate-100 dark:hover:bg-gray-600"
							onClick={reset_game}
						>
							New
						</button>
						<h1
							className={`text-center text-xl font-bold transition-colors ${(() => {
								if (hasWon()) {
									return "text-green-600";
								} else if (hasLost()) {
									return "text-red-600";
								} else {
									return "text-black dark:text-slate-100";
								}
							})()}`}
						>
							{(() => {
								if (hasWon()) {
									return "You Won";
								} else if (hasLost()) {
									return "You Loose";
								} else {
									return "Wordle";
								}
							})()}
						</h1>
						<a
							className="h-10 w-10 rounded-sm border border-slate-600 bg-slate-200 text-black transition-colors hover:bg-slate-400 disabled:bg-slate-300 dark:border-0 dark:bg-gray-800 dark:text-slate-100 dark:hover:bg-gray-600"
							href="https://github.com/AFCMS/rwordle"
						>
							<svg class="w-auto h-auto" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd"
											d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
											fill="#24292f" />
							</svg>
						</a>
					</div>
					<div className="grid select-none grid-cols-5 grid-rows-6 gap-4">
						{(() => {
							const lines = [];
							for (let r = 0; r < 5; r++) {
								lines.push(build_row(curentWord, rows[r], r));
							}
							return lines;
						})()}
						<input
							type="text"
							name="input"
							id="input"
							className="transition-color col-span-4 h-16 appearance-none rounded-sm border border-slate-600 bg-slate-200 pl-4 text-left text-black focus:outline-hidden dark:border-0 dark:bg-gray-800 dark:text-white"
							placeholder={
								hasWon() || hasLost() ? "Try again?" : "Type a word here..."
							}
							value={input}
							disabled={hasWon() || hasLost() || newWord}
							onChange={(e) => {
								if (
									e.currentTarget.value.length <= 5 &&
									(/^[a-zA-Z]+$/.test(e.currentTarget.value) ||
										e.currentTarget.value === "") &&
									!hasWon()
								) {
									setInput(e.currentTarget.value);
								}
							}}
							onKeyDown={(e) => {
								if (e.key && e.key == "Enter") {
									push_rows();
								}
							}}
							autoFocus
						/>
						<button
							className="h-16 w-16 rounded-sm border border-slate-600 bg-slate-200 text-black transition-colors hover:bg-slate-400 disabled:bg-slate-300 dark:border-0 dark:bg-gray-800 dark:text-slate-100 dark:hover:bg-gray-600"
							onClick={() => {
								push_rows();
							}}
						>
							Enter
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
