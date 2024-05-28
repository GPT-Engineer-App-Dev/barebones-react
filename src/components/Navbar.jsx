import { Box, Flex, Link, Button, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("black", "white");

  return (
    <Box bg={bg} px={4} boxShadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Link as={RouterLink} to="/" px={2} py={1} rounded="md" _hover={{ textDecoration: "none", bg: useColorModeValue("gray.200", "gray.700") }}>
            Home
          </Link>
          <Link as={RouterLink} to="/venues" px={2} py={1} rounded="md" _hover={{ textDecoration: "none", bg: useColorModeValue("gray.200", "gray.700") }}>
            Venues
          </Link>
        </Box>
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <FaMoon /> : <FaSun />}
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;