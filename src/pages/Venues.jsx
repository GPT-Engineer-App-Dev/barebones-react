import { useState, useEffect } from "react";
import { useVenues, useAddVenue, useUpdateVenue, useDeleteVenue } from "../integrations/supabase/index.js";
import { Input, FormControl, FormLabel, Container, Text, VStack, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";

const Venues = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterText, setFilterText] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [venueData, setVenueData] = useState({ name: "", location: "", description: "" });
  const { data: venues, isLoading, error } = useVenues();
  const addVenue = useAddVenue();
  const updateVenue = useUpdateVenue();
  const deleteVenue = useDeleteVenue();

  useEffect(() => {
    if (venues) {
      setFilteredVenues(
        venues.filter((venue) =>
          venue.name.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }
  }, [filterText, venues]);

  const handleVenueClick = (venue) => {
    setSelectedVenue(venue);
    setVenueData({ name: venue.name, location: venue.location, description: venue.description });
    onOpen();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (selectedVenue) {
      updateVenue.mutate({ ...venueData, id: selectedVenue.id });
    } else {
      addVenue.mutate(venueData);
    }
    setIsEditing(false);
    onClose();
  };

  const handleDeleteClick = () => {
    deleteVenue.mutate(selectedVenue.id);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddVenueClick = () => {
    setSelectedVenue(null);
    setVenueData({ name: "", location: "", description: "" });
    setIsEditing(true);
    onOpen();
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Heading as="h1" size="2xl" mb={4}>Venues</Heading>
        <Button colorScheme="teal" size="lg" mt={6} onClick={handleAddVenueClick}>
          Add Venue
        </Button>
        <FormControl>
          <FormLabel>Filter Venues</FormLabel>
          <Input
            placeholder="Enter venue name"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </FormControl>
        {isLoading && <Text>Loading venues...</Text>}
        {error && <Text>Error loading venues: {error.message}</Text>}
        {venues && (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Location</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredVenues.map((venue) => (
                <Tr key={venue.id} onClick={() => handleVenueClick(venue)} cursor="pointer">
                  <Td>{venue.name}</Td>
                  <Td>{venue.location}</Td>
                  <Td>{venue.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Venue" : selectedVenue ? selectedVenue.name : "Add Venue"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={venueData.name} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input name="location" value={venueData.location} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input name="description" value={venueData.description} onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveClick}>
              Save
            </Button>
            {selectedVenue && (
              <Button colorScheme="red" mr={3} onClick={handleDeleteClick}>
                Delete
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Venues;