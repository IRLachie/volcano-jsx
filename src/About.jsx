import React, { useState, useEffect } from 'react';
import './styles.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Center, Select, Spinner } from '@chakra-ui/react';
import makeApiRequest from './Api';

export default function About() {
	const [rowData, setRowData] = useState([]);
	const [country, setCountry] = useState('Japan');
	const [countryData, setCountryData] = useState([]);
	const [isloading, setLoading] = useState(false);

	const columns = [
		{ headerName: 'Name', field: 'name', sortable: true, filter: true },
		{ headerName: 'Country', field: 'country', sortable: true },
		{ headerName: 'Region', field: 'region', sortable: true },
		{ headerName: 'Subregion', field: 'subregion', sortable: true },
	];

	useEffect(() => {
		makeApiRequest('/countries', 'GET').then(countries => setCountryData(countries));
	}, []);

	useEffect(() => {
		setLoading(true);
		makeApiRequest('/volcanoes?country=' + country, 'GET')
			.then(volcanoes => setRowData(volcanoes))
			.catch(err => {
				Error(err);
			})
			.finally(() => {
				setLoading();
			});
	}, [country]);

	if (isloading) {
		return (
			<>
				<p>.</p>
				<div style={{ marginTop: '40vh', marginLeft: '100vh' }}>
					<Spinner size="lg" />
				</div>
			</>
		);
	}

	return (
		<div
			className="container"
			style={{ flexShrink: '1', marginTop: '5em', position: 'absolute', marginLeft: '50vh' }}
		>
			<Select
				style={{ marginBottom: '1em' }}
				onChange={event => setCountry(event.target.value)}
				placeholder="Pick an option..."
			>
				{countryData.map((country, id) => {
					return (
						<option value={country} key={id}>
							{country}
						</option>
					);
				})}
			</Select>
			<Center>
				<h1 style={{ marginBlock: '1em' }}>{country}</h1>
			</Center>
			<div
				className="ag-theme-balham"
				style={{
					height: '700px',
					width: '1005px',
					flexWrap: 'wrap',
				}}
			>
				<AgGridReact
					columnDefs={columns}
					rowData={rowData}
					pagination={true}
					paginationPageSize={26}
					rowSelection="single"
				/>
				{/* <Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>{}</ModalHeader>
						<ModalCloseButton />
						<ModalBody>10</ModalBody>

						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={onClose}>
								Close
							</Button>
							<Button variant="ghost">Secondary Action</Button>
						</ModalFooter>
					</ModalContent>
				</Modal> */}
			</div>
		</div>
	);
}
