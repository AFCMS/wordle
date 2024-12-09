// SPDX-FileCopyrightText: 2024 AFCMS <afcm.contact@gmail.com>
// SPDX-License-Identifier: GPL-3.0-or-later

import { JSX } from "preact";
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
							className="h-10 w-10 rounded-sm border border-slate-600 bg-slate-200 text-black transition-colors hover:bg-slate-400 disabled:bg-slate-300 dark:border-0 dark:bg-gray-800 dark:text-slate-100 dark:hover:bg-gray-600 flex justify-center"
							href="https://github.com/AFCMS/wordle"
							aria-label="GitHub Repository"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="h-10 w-10"
							>
								<path
									fillRule="evenodd"
									d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.91-1.294 2.75-1.025 2.75-1.025.544 1.376.201 2.393.099 2.646.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.687-4.565 4.936.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.748 0 .268.18.579.688.481C19.138 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z"
									clipRule="evenodd"
								/>
							</svg>
						</a>
					</div>
					<div className="grid select-none grid-cols-5 grid-rows-6 gap-4 mt-4">
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
