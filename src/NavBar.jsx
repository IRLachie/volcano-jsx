/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
	Divider,
	HStack,
	Button,
	Center,
	Box,
	useDisclosure,
	Drawer,
	DrawerContent,
	DrawerBody,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerHeader,
	Input,
} from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import About from "./About";
import bgimage1 from "./bgimage1.jpg";
import Book from "./Book";

import "./styles.css";
import makeApiRequest from "./Api";

const Home = () => (
	<Box
		minHeight="200vh"
		backgroundImage={bgimage1}
		backgroundRepeat="no-repeat"
		backgroundSize="cover"
		//width="100%"
	/>
);

async function login(username, password) {
	const token = await makeApiRequest("/user/login", "POST", JSON.stringify({ email: username, password: password }));
	localStorage.setItem("token", token);
}

function onClick() {
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	console.log(username, password);

	login(username, password);
	console.log(localStorage.getItem("token"));
}

export default function NavBar() {
	const isLoggedin = false;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

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
				<HStack style={{ marginTop: "1em", marginLeft: "1em", marginBottom: "1em", flexGrow: "1" }}>
					<Link to={`/`}>
						<Button leftIcon={<HamburgerIcon />} size="sm" colorScheme="teal" variant="outline">
							Home
						</Button>
					</Link>
					<Center height="20px">
						<Divider orientation="vertical" />
					</Center>
					<Link to={`/About`}>
						<Button leftIcon={<SearchIcon />} size="sm" colorScheme="teal" variant="outline" flexGrow="1">
							Find HOT Flowing Volcanoes in YOUR Area
						</Button>
					</Link>
				</HStack>
				{isLoggedin ? (
					<Button size="sm" colorScheme="teal" variant="link" marginRight="1em">
						Log-Out
					</Button>
				) : (
					<>
						<Button
							ref={btnRef}
							size="sm"
							colorScheme="teal"
							variant="link"
							marginRight="1em"
							onClick={onOpen}
						>
							Log-in
						</Button>
						<Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
							<DrawerOverlay />
							<DrawerContent>
								<DrawerCloseButton />
								<DrawerHeader>Login</DrawerHeader>
								<DrawerBody>
									<Input id="username" placeholder="Username" variant="flushed" isRequired />
									<Input
										id="password"
										placeholder="Password"
										variant="flushed"
										type={"password"}
										isRequired
									/>
									<Button style={{ marginTop: "1em" }} colorScheme="blue" onClick={onClick}>
										Login
									</Button>
								</DrawerBody>
							</DrawerContent>
						</Drawer>
						<Button size="sm" colorScheme="teal" variant="link" marginRight="1em">
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
