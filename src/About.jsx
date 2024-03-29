/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import "./styles.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import {
	Center,
	HStack,
	Select,
	Spinner,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Flex,
	Box,
} from "@chakra-ui/react";
import makeApiRequestLoggedin, { makeApiRequest } from "./Api";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function About() {
	const [rowData, setRowData] = useState([""]);
	const [volcanoData, setVolcanoData] = useState([""]);
	const [country, setCountry] = useState("Algeria");
	const [within, setWithin] = useState("");
	const [id, setId] = useState("90");
	const [countryData, setCountryData] = useState([]);
	const [isloading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const gridRef = useRef();
	const [loggedin, setLoggedin] = useState();

	useEffect(() => {
		const isloggedin = localStorage.getItem("loggedin");
		setLoggedin(isloggedin);
	}, [localStorage.getItem("loggedin")]);

	const columns = [
		{ headerName: "Name", field: "name", sortable: true, filter: true },
		{ headerName: "Country", field: "country", sortable: true },
		{ headerName: "Region", field: "region", sortable: true },
		{ headerName: "Subregion", field: "subregion", sortable: true },
		{ headerName: "ID", field: "id" },
	];

	useEffect(() => {
		setRowData("");
		makeApiRequest("/countries", "GET").then(countries => setCountryData(JSON.parse(JSON.stringify(countries))));
	}, []);

	useEffect(() => {
		if (loggedin === "true") {
			console.log("You are logged in");
			makeApiRequestLoggedin(`/volcano/${id}`, "GET")
				.then(resp => setVolcanoData(JSON.parse(JSON.stringify(resp))))
				.catch(err => {
					Error(err);
				})
				.finally(() => {
					setLoading(false);
				});
		} else if (loggedin === "false") {
			console.log("You arent logged in");
			makeApiRequest(`/volcano/${id}`, "GET")
				.then(resp => setVolcanoData(JSON.parse(JSON.stringify(resp))))
				.catch(err => {
					Error(err);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [id, loggedin]);

	useEffect(() => {
		setLoading(true);
		makeApiRequest("/volcanoes?country=" + country + "&populatedWithin=" + within, "GET")
			.then(volcanoes => setRowData(JSON.parse(JSON.stringify(volcanoes))))
			.catch(err => {
				Error(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [country, within, loggedin]);

	const onHandleClick = useCallback(() => {
		const selectedNode = gridRef.current.api.getSelectedNodes();
		setId(selectedNode.map(node => node.data.id));
		setIsOpen(true);
	});

	const getRowId = useCallback(params => {
		return params.data.id;
	});

	const latlng = [
		volcanoData.latitude !== undefined ? volcanoData.latitude : 0,
		volcanoData.longitude !== undefined ? volcanoData.longitude : 0,
	];

	return (
		<div
			className="container"
			style={{
				flexShrink: "1",
				marginTop: "6em",
				position: "absolute",
				marginLeft: "33%",
				backgroundColor: "rgba(247,247,247, 0.5)",
			}}
		>
			<HStack>
				<Select
					onChange={event => setCountry(event.target.value)}
					placeholder="Pick an option..."
					backgroundColor="white"
					style={{ flexGrow: "1" }}
					rounded="none"
				>
					{countryData.map((country, id) => {
						return (
							<option value={country} key={id}>
								{country}
							</option>
						);
					})}
				</Select>
				<Select onChange={event => setWithin(event.target.value)} w="150px" placeholder="All" variant="flushed">
					<option value="5km" key="1">
						5km
					</option>
					<option value="10km" key="2">
						10km
					</option>
					<option value="30km" key="3">
						30km
					</option>
					<option value="100km" key="4">
						100km
					</option>
				</Select>
			</HStack>

			<Center>
				<h1
					style={{
						marginBlock: "1em",
						color: "dark grey",
						fontSize: "15pt",
						fontWeight: "bold",
					}}
				>
					{country.toUpperCase()}
				</h1>
			</Center>
			<div
				className="ag-theme-balham"
				style={{
					height: "700px",
					width: "802px",
					flexWrap: "wrap",
				}}
			>
				{!isloading ? (
					<>
						<AgGridReact
							ref={gridRef}
							columnDefs={columns}
							rowData={rowData}
							pagination={true}
							paginationPageSize={26}
							rowSelection="single"
							getRowId={getRowId}
							onCellDoubleClicked={onHandleClick}
						/>
						<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
							<ModalOverlay />
							<ModalContent style={{ maxWidth: "70em" }}>
								<ModalHeader>
									<h1 style={{ fontWeight: "bold" }}>{volcanoData.name?.toUpperCase()}</h1>
									<h3 style={{ fontSize: "11pt", color: "lightgrey" }}>
										{volcanoData.subregion +
											" / " +
											volcanoData.region +
											" | " +
											volcanoData.country}
									</h3>
								</ModalHeader>
								<ModalCloseButton />
								<ModalBody>
									<Flex>
										<Box w="20em" h="20em" bg="#f7f7f7" rounded="md">
											<div style={{ marginLeft: "1em", marginTop: "1em" }}>
												Country: {volcanoData.country}
												<br />
												Region: {volcanoData.region}
												<br />
												Subregion: {volcanoData.subregion}
												<br />
												Last Eruption: {volcanoData.last_eruption}
												<br />
												Summit: {volcanoData.summit}
												<br />
												Elevation: {volcanoData.elevation}
											</div>
										</Box>
										{!isloading ? (
											<MapContainer
												center={[0, 0]}
												zoom={1}
												scrollWheelZoom={true}
												minZoom={1}
												style={{ marginLeft: "2em", width: "60em", height: "27em" }}
											>
												<TileLayer
													attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
													url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
												/>
												<Marker position={latlng !== undefined ? latlng : [0, 0]}>
													<Popup>
														{volcanoData.name}
														<br />
														{volcanoData.country}
													</Popup>
												</Marker>
											</MapContainer>
										) : (
											<Spinner />
										)}
									</Flex>
								</ModalBody>
								{loggedin === "true" ? (
									<div style={{ marginLeft: "2em", marginBottom: "2em" }}>
										<Line
											data={{
												labels: ["5km", "10km", "30km", "100km"],
												datasets: [
													{
														label: "Population",
														data: [
															volcanoData.population_5km,
															volcanoData.population_10km,
															volcanoData.population_30km,
															volcanoData.population_100km,
														],
													},
												],
											}}
										/>
									</div>
								) : (
									<p style={{ marginLeft: "2em", marginBottom: "1em", fontWeight: "bold" }}>
										Login to see chart data...
									</p>
								)}
							</ModalContent>
						</Modal>
					</>
				) : (
					<Spinner size="xl" marginTop="35%" marginLeft="47%" />
				)}
			</div>
		</div>
	);
}
