import { HStack, Button, Center, Divider } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon, HamburgerIcon } from "@chakra-ui/icons";

export default function HStackComp() {
	return (
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
	);
}
