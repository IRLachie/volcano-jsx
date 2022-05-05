/* eslint-disable no-console */
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
	Button,
	Box,
	Drawer,
	DrawerContent,
	DrawerBody,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerHeader,
	Input,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverCloseButton,
} from "@chakra-ui/react";

import About from "./About";

import HStackComp from "./components/HStackComp";

import "./styles.css";
import makeApiRequest from "./Api";
import { PopoverHeader } from "reactstrap";

const Home = () => <p></p>;

export default function NavBar() {
	const [isLoggedin, setIsLoggedin] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const btnRef = React.useRef();

	const token = localStorage.getItem("token");

	async function login(username, password) {
		await makeApiRequest("/user/login", "POST", JSON.stringify({ email: username, password: password })).then(
			token => {
				localStorage.setItem("token", token.token);

				if (token.token !== undefined || null) setIsLoggedin(true);
			}
		);
	}

	function onClick() {
		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;

		login(username, password);

		//Clear fields
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";
	}

	function logout() {
		localStorage.clear("token");

		setIsLoggedin(false);
		setIsOpen(false);
	}

	return (
		<div className="NavBar">
			<Box
				height="4em"
				minWidth="100%"
				style={{
					display: "flex",
					position: "fixed",
					flexGrow: "1",
					backgroundColor: "rgba(247,247,247, 0.7)",
				}}
			>
				<HStackComp />
				{isLoggedin ? (
					<>
						<Button size="sm" colorScheme="teal" variant="link" marginRight="1em" onClick={logout}>
							Log-Out
						</Button>
						<Popover placement="bottom">
							<PopoverTrigger>
								<Button
									size="sm"
									colorScheme="teal"
									variant="link"
									marginRight="1em"
									onClick={() => console.log(localStorage.getItem("token"))}
								>
									Obtain JWT
								</Button>
							</PopoverTrigger>
							<PopoverContent color="white" bg="blue.800" borderColor="blue.800">
								<PopoverHeader>
									<Box bg="tomato" p={2} color="white" rounded="lg">
										<h1 style={{ marginLeft: "8em" }}>JWT KEY</h1>
									</Box>
								</PopoverHeader>
								<PopoverCloseButton />
								<PopoverBody>{token}</PopoverBody>
							</PopoverContent>
						</Popover>
					</>
				) : (
					<>
						<Button
							ref={btnRef}
							size="sm"
							colorScheme="teal"
							variant="link"
							marginRight="1em"
							onClick={() => setIsOpen(true)}
						>
							Log-in
						</Button>
						<Drawer
							isOpen={isOpen}
							placement="right"
							onClose={() => setIsOpen(false)}
							finalFocusRef={btnRef}
						>
							<DrawerOverlay />
							<DrawerContent>
								<DrawerCloseButton />
								<DrawerHeader>Login</DrawerHeader>
								<DrawerBody>
									<Input id="username" placeholder="Username" variant="flushed" />
									<Input id="password" placeholder="Password" variant="flushed" type={"password"} />

									<Button style={{ marginTop: "1em" }} colorScheme="blue" onClick={onClick}>
										Login
									</Button>
								</DrawerBody>
							</DrawerContent>
						</Drawer>
						<Button
							size="sm"
							colorScheme="teal"
							variant="link"
							marginRight="1em"
							onClick={() => console.log(localStorage.getItem("token"))}
						>
							Register
						</Button>
					</>
				)}
			</Box>

			<main>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/About" element={<About />} />
				</Routes>
			</main>
		</div>
	);
}
