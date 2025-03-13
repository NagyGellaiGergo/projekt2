<script>
    import { goto } from "$app/navigation";
    import { isLoggedIn } from "../../stores/auth";

    let email = "";
    let password = "";
    let errorMessage = "";
    let isLoading = false;

    async function login() {
        errorMessage = "";
        isLoading = true;

        try {
            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                method: "GET",
                credentials: "include"
            });

            const csrfCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='));

            const csrfToken = csrfCookie
                ? decodeURIComponent(csrfCookie.split('=')[1])
                : '';

            if (!csrfToken) {
                errorMessage = 'CSRF token nem található';
                return;
            }

            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-XSRF-TOKEN": csrfToken
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                isLoggedIn.set(true);
                goto("/dashboard");
            } else {
                const errorData = await response.json();

                if (errorData.errors) {
                    errorMessage = Object.values(errorData.errors).flat().join(', ');
                } else {
                    errorMessage = errorData.message || 'Bejelentkezés sikertelen';
                }
            }
        } catch (error) {
            console.error('Hálózati hiba:', error);
            errorMessage = 'Hálózati hiba történt';
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="login-container">
    <h2>Bejelentkezés</h2>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={login}>
        <label for="email">Email:</label>
        <input id="email" type="email" bind:value={email} required />

        <label for="password">Jelszó:</label>
        <input id="password" type="password" bind:value={password} required />

        <button type="submit" disabled={isLoading}>
            {isLoading ? 'Bejelentkezés...' : 'Bejelentkezés'}
        </button>
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
    button:hover:not([disabled]) { background: #0056b3; }
    button[disabled] {
        background: #cccccc;
        cursor: not-allowed;
    }
    .error { color: red; text-align: center; }
</style>