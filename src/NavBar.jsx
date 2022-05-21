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
	useToast,
	Center,
} from "@chakra-ui/react";

import About from "./About";

import HStackComp from "./components/HStackComp";

import "./styles.css";
import makeApiRequest from "./Api";

const Home = () => (
	<Center>
		<div style={{ position: "absolute", marginTop: "50%" }}>
			<h1
				style={{
					fontWeight: "bold",
					fontSize: "60px",
					color: "rgba(247,247,247, 0.3)",
					fontFamily: "monospace",
					fontStyle: "oblique",
					userSelect: "none",
				}}
			>
				Volcano.jsx
			</h1>
		</div>
	</Center>
);

export default function NavBar() {
	const [isLoggedin, setIsLoggedin] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenR, setIsOpenR] = useState(false);
	const btnRef = React.useRef();
	const toast = useToast();
	const token = localStorage.getItem("token");

	function login(username, password) {
		makeApiRequest("/user/login", "POST", JSON.stringify({ email: username, password: password })).then(token => {
			localStorage.setItem("token", token.token);

			if (token.token !== undefined || null) {
				setIsLoggedin(true);
				localStorage.setItem("loggedin", "true");
			} else if (token === "401") {
				toast({
					title: token,
					description: "Incorrect email or password ...",
					status: "error",
					duration: 2000,
					isClosable: true,
				});
			} else {
				toast({
					title: token,
					description: "Request body incomplete, both email and password are required ...",
					status: "error",
					duration: 2000,
					isClosable: true,
				});
			}
		});
	}

	async function register(username, password) {
		await makeApiRequest("/user/register", "POST", JSON.stringify({ email: username, password: password })).then(
			message => {
				if (message === "409") {
					toast({
						title: message,
						description: "User already exists...",
						status: "error",
						duration: 2000,
						isClosable: true,
					});
				} else if (message === "400") {
					toast({
						title: message,
						description: "Request body incomplete, both email and password are required...",
						status: "error",
						duration: 2000,
						isClosable: true,
					});
				} else {
					toast({
						title: "Success!",
						description: "User created...",
						status: "success",
						duration: 2000,
						isClosable: true,
					});
					setIsOpenR(false);
				}
			}
		);
	}

	function onRegister() {
		const username = document.getElementById("usernameR").value;
		const password = document.getElementById("passwordR").value;
		register(username, password);
		//Clear fields
		document.getElementById("usernameR").value = "";
		document.getElementById("passwordR").value = "";
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
		localStorage.setItem("loggedin", "false");

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
						<Button
							size="sm"
							colorScheme="teal"
							variant="link"
							marginRight="1em"
							onClick={() => {
								toast({
									description: token,
									status: "info",
									duration: 2000,
									isClosable: true,
								});
							}}
						>
							Obtain JWT
						</Button>
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
							onClick={() => setIsOpenR(true)}
						>
							Register
						</Button>
						<Drawer
							isOpen={isOpenR}
							placement="right"
							onClose={() => setIsOpenR(false)}
							finalFocusRef={btnRef}
						>
							<DrawerOverlay />
							<DrawerContent>
								<DrawerCloseButton />
								<DrawerHeader>Register</DrawerHeader>
								<DrawerBody>
									<Input id="usernameR" placeholder="Username" variant="flushed" />
									<Input id="passwordR" placeholder="Password" variant="flushed" type={"password"} />

									<Button style={{ marginTop: "1em" }} colorScheme="blue" onClick={onRegister}>
										Register
									</Button>
								</DrawerBody>
							</DrawerContent>
						</Drawer>
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
