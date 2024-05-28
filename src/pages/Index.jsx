import { useState } from "react";
import { Container, Text, VStack, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { FaRocket } from "react-icons/fa";
import { useEvents } from "../integrations/supabase/index.js";

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { data: events, isLoading, error } = useEvents();

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Heading as="h1" size="2xl" mb={4}>Welcome to Your New App</Heading>
        <Text fontSize="xl">This is your starting point. Let's build something amazing!</Text>
        <Button leftIcon={<FaRocket />} colorScheme="teal" size="lg" mt={6}>
          Get Started
        </Button>
        {isLoading && <Text>Loading events...</Text>}
        {error && <Text>Error loading events: {error.message}</Text>}
        {events && (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Date</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map((event) => (
                <Tr key={event.id} onClick={() => handleEventClick(event)} cursor="pointer">
                  <Td>{event.name}</Td>
                  <Td>{event.date}</Td>
                  <Td>{event.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedEvent?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text><strong>Date:</strong> {selectedEvent?.date}</Text>
            <Text><strong>Description:</strong> {selectedEvent?.description}</Text>
            <Text><strong>Comments:</strong></Text>
            {selectedEvent?.comments?.length > 0 ? (
              selectedEvent.comments.map((comment) => (
                <Text key={comment.id}>&quot;{comment.content}&quot;</Text>
              ))
            ) : (
              <Text>No comments available.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;