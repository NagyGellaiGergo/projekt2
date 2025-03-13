<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { apiFetch } from '$lib/api.js';

  let user = null;
  let error = '';

  onMount(async () => {
    try {
      const data = await apiFetch('user'); // Laravel visszaadja a felhasználó adatait
      user = data;
    } catch (err) {
      error = 'Nem sikerült betölteni az adatokat.';
    }
  });

  function logout() {
    localStorage.removeItem('token'); // Token törlése
    goto('/login');
  }
</script>

{#if user}
  <h1>Üdvözöllek, {user.name}!</h1>
  <button on:click={logout}>Kijelentkezés</button>
{:else if error}
  <p>{error}</p>
{/if}
