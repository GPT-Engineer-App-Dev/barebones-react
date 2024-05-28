import { Container, Text, VStack, Heading, Button } from "@chakra-ui/react";
import { FaRocket } from "react-icons/fa";

const Index = () => {
  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Heading as="h1" size="2xl" mb={4}>Welcome to Your New App</Heading>
        <Text fontSize="xl">This is your starting point. Let's build something amazing!</Text>
        <Button leftIcon={<FaRocket />} colorScheme="teal" size="lg" mt={6}>
          Get Started
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;