<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let email = "";
    let password = "";
    let errorMessage = "";

    async function login() {
        errorMessage = "";
        try {
            const res = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                goto('/dashboard');
            }else{
                errorMessage= data.message || 'Hibás bejelentkezés';
            }

        } catch (err) {
            errorMessage = "Hálózati hiba!";
        }
    }
</script>

<div class="login-container">
    <h2>Bejelentkezés</h2>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={login}>

        <label>Email:</label>
        <input type="email" bind:value={email} required />

        <label>Jelszó:</label>
        <input type="password" bind:value={password} required />

        <button type="submit">Login</button>
    </form>

    <p>Nincs még fiókod? <a href="/register">Regisztrálj!</a></p>
</div>

<style>
    .login-container {
        max-width: 400px;
        margin: auto;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h2 { text-align: center; }
    label { display: block; margin-top: 10px; }
    input {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        width: 100%;
        padding: 10px;
        margin-top: 15px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover { background: #0056b3; }
    .error { color: red; text-align: center; }
</style>
