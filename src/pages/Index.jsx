import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/index.js";
import { useUpdateEvent, useDeleteEvent } from "../integrations/supabase/index.js";
import { Input, FormControl, FormLabel } from "@chakra-ui/react";
import { Container, Text, VStack, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Image } from "@chakra-ui/react";
import { FaRocket } from "react-icons/fa";
import { useEvents } from "../integrations/supabase/index.js";

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterText, setFilterText] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState({ name: "", date: "", description: "", image_url: "" });
  const [pdfFile, setPdfFile] = useState(null);
  const { data: events, isLoading, error } = useEvents();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  useEffect(() => {
    if (events) {
      setFilteredEvents(
        events.filter((event) =>
          event.name.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }
  }, [filterText, events]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEventData({ name: event.name, date: event.date, description: event.description, image_url: event.image_url });
    onOpen();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
  let pdfUrl = eventData.pdf_url;

  if (pdfFile) {
    const { data, error } = await supabase.storage
      .from('event-pdfs')
      .upload(`public/${pdfFile.name}`, pdfFile);

    if (error) {
      console.error("Error uploading PDF:", error);
      return;
    }

    pdfUrl = data.Key;
  }

  updateEvent.mutate({ ...eventData, id: selectedEvent.id, pdf_url: pdfUrl });
  setIsEditing(false);
  onClose();
};

  const handleDeleteClick = () => {
    deleteEvent.mutate(selectedEvent.id);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      setPdfFile(files[0]);
    } else {
      setEventData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Heading as="h1" size="2xl" mb={4}>Welcome to Your New App</Heading>
        <Text fontSize="xl">This is your starting point. Let's build something amazing!</Text>
        <Button leftIcon={<FaRocket />} colorScheme="teal" size="lg" mt={6}>
          Get Started
        </Button>
        <FormControl>
          <FormLabel>Filter Events</FormLabel>
          <Input
            placeholder="Enter event name"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </FormControl>
        {isLoading && <Text>Loading events...</Text>}
        {error && <Text>Error loading events: {error.message}</Text>}
        {events && (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th>Image</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEvents.map((event) => (
                <Tr key={event.id} onClick={() => handleEventClick(event)} cursor="pointer">
                  <Td>{event.name}</Td>
                  <Td>{event.date}</Td>
                  <Td>{event.description}</Td>
                  <Td>
                    {event.image_url && (
                      <Image src={event.image_url} alt={event.name} boxSize="50px" objectFit="cover" />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Event" : selectedEvent?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isEditing ? (
              <>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" value={eventData.name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input name="date" value={eventData.date} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input name="description" value={eventData.description} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <Input name="image_url" value={eventData.image_url} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>PDF File</FormLabel>
                  <Input type="file" name="pdf" onChange={handleChange} />
                </FormControl>
              </>
            ) : (
              <>
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
                {selectedEvent?.image_url && (
                  <Image src={selectedEvent.image_url} alt={selectedEvent.name} />
                )}
                {selectedEvent?.pdf_url && (
                  <Text>
                    <strong>PDF:</strong> <a href={selectedEvent.pdf_url} target="_blank" rel="noopener noreferrer">View PDF</a>
                  </Text>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {isEditing ? (
              <Button colorScheme="blue" mr={3} onClick={handleSaveClick}>
                Save
              </Button>
            ) : (
              <>
                <Button colorScheme="blue" mr={3} onClick={handleEditClick}>
                  Edit
                </Button>
                <Button colorScheme="red" mr={3} onClick={handleDeleteClick}>
                  Delete
                </Button>
              </>
            )}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;