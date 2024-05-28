import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { supabase } from "../integrations/supabase/index.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <Container centerContent>
      <VStack spacing={4} mt={10}>
        <Heading as="h1">Login</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" onClick={handleLogin}>Login</Button>
      </VStack>
    </Container>
  );
};

export default Login;