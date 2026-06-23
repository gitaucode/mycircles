import { useEffect } from 'react';
import { router } from 'expo-router';

// The create tab immediately opens the create-circle modal
export default function CreateTab() {
  useEffect(() => {
    router.push('/modal/create-circle');
  }, []);
  return null;
}
