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
	Input
} from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import About from "./About";
import bgimage1 from "./bgimage1.jpg";
import Book from "./Book";
import credentials from "./credentials.json";

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

export default function NavBar() {
	const isLoggedin = false;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	const [keyData, setKeyData] = useState("");

	const JWT = "";

	console.log(credentials);

	useEffect(() => {
		fetch("http://sefdb02.qut.edu.au:3001/user/login", {
			method: "POST",
			body: JSON.stringify({
				email: "mike@gmail.com",
				password: "password"
			}),
			headers: {
				accept: "application/json"
			}
		});
	}, []);

	return (
		<div className="NavBar">
			<Box
				height="4em"
				minWidth="100%"
				style={{
					display: "flex",
					position: "fixed",
					flexGrow: "1",
					backgroundColor: "rgba(247,247,247, 0.7)"
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
									<Input placeholder="Username" variant="flushed" isRequired />
									<Input placeholder="Password" variant="flushed" type={"password"} isRequired />
									<Button style={{ marginTop: "1em" }} colorScheme="blue">
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
