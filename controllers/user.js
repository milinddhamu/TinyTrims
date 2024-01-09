import axios from 'axios';
import { nanoid } from 'nanoid';

export default function handleStoreUserData({ session, destinationLinkInput }) {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const uniqueTag = nanoid(8);

  // Create the domain data
  const domainData = {
    destination: destinationLinkInput,
    timestamp: timestamp,
    links: [{
      id: nanoid(6),
      views: [],
      destination: destinationLinkInput,
      timestamp: timestamp,
    }]
  };

  // Create the user data
  const userData = {
    tag: uniqueTag,
    name: session?.user.name,
    email: session?.user.email,
    timestamp: timestamp,
    domains: [domainData]
  };

  const linkData = {
    id: nanoid(6), views: [], timestamp ,destination: destinationLinkInput
  }

  // Extract email from userData
  const email = session?.user.email;
  const encodedEmail = encodeURIComponent(email);

  axios.get(`/api/users/${encodedEmail}`)
    .then(getResponse => {
      if (getResponse.data.user?.email) {
        const existingUser = getResponse.data.user;
        const existingDomain = existingUser.domains.find(domain => domain.destination === destinationLinkInput);

        if (existingDomain) {
          const newLink = linkData;

          axios.put(`/api/users/${encodedEmail}`, {
            domainId: existingDomain._id,
            link: newLink
          })
            .then(putResponse => {
              console.log('Links array updated successfully:', putResponse.data);
            })
            .catch(putError => {
              console.error('Error updating links array:', putError);
              handlePutError(putError);
            });
        } else {
          const updatedDomains = [...existingUser.domains, domainData];

          axios.put(`/api/users/${encodedEmail}`, { domains: updatedDomains })
            .then(putResponse => {
              console.log('User domains updated successfully:', putResponse.data);
            })
            .catch(putError => {
              console.error('Error updating user domains:', putError);
              handlePutError(putError);
            });
        }
      } else {
        axios.post('/api/users', userData)
          .then(postResponse => {
            console.log('User created successfully:', postResponse.data);
          })
          .catch(postError => {
            console.error('Error creating user:', postError);
            handlePostError(postError);
          });
      }
    })
    .catch(getError => {
      console.error('Error checking user existence:', getError);
      handleGetError(getError);
    });

  // Function to handle PUT request errors
  function handlePutError(error) {
    if (error.response && error.response.status === 400) {
      console.error('Bad Request:', error.response.data.error);
      // Handle specific error message or show it to the user
    } else if (error.response && error.response.status === 404) {
      console.error('Not Found:', error.response.data.message);
      // Handle specific error message or show it to the user
    } else {
      console.error('Internal Server Error:', error.message);
      // Handle generic error message or show it to the user
    }
  }

  // Function to handle POST request errors
  function handlePostError(error) {
    if (error.response && error.response.status === 400) {
      console.error('Bad Request:', error.response.data.error);
      // Handle specific error message or show it to the user
    } else {
      console.error('Internal Server Error:', error.message);
      // Handle generic error message or show it to the user
    }
  }

  // Function to handle GET request errors
  function handleGetError(error) {
    if (error.response && error.response.status === 404) {
      console.error('Not Found:', error.response.data.message);
      // Handle specific error message or show it to the user
    } else {
      console.error('Internal Server Error:', error.message);
      // Handle generic error message or show it to the user
    }
  }
}
