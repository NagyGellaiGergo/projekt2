<script>
    import { goto } from "$app/navigation";
    import { isLoggedIn } from "../../stores/auth"; // Importáljuk a store-t

    let email = "";
    let password = "";
    let errorMessage = "";

    async function login() {
        errorMessage = "";
        try {
            // 1. CSRF token lekérése
            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                method: "GET",
                credentials: "include"
            });

            // 2. CSRF token kiolvasása a sütiből
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

            // 3. Bejelentkezési kérés
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": csrfToken, // CSRF token hozzáadása
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            // 4. Válasz feldolgozása
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    localStorage.setItem("token", data.access_token); // Token mentése
                    isLoggedIn.set(true); // A bejelentkezett állapot frissítése
                    goto("/dashboard"); // Átirányítás a dashboardra
                }
            } else {
                // Hiba esetén
                const contentType = response.headers.get('content-type');
                console.log('Hiba Content-Type:', contentType);

                if (contentType && contentType.includes('application/json')) {
                    try {
                        const errorData = await response.json();
                        console.log('Hiba adatok:', errorData);

                        if (errorData.errors) {
                            // Hibák összefűzése
                            const errorMessages = Object.values(errorData.errors)
                                .flat()
                                .join(', ');
                            errorMessage = errorMessages;
                        } else {
                            errorMessage = errorData.message || 'Bejelentkezés sikertelen';
                        }
                    } catch (parseError) {
                        console.error('JSON parse hiba:', parseError);
                        errorMessage = `Hiba történt a válasz feldolgozása során: ${response.status}`;
                    }
                } else {
                    // Ha nincs JSON válasz
                    const textResponse = await response.text();
                    console.log('Szöveges válasz:', textResponse);
                    errorMessage = `Hiba történt a bejelentkezés során: ${response.status} ${response.statusText}`;
                }
            }
        } catch (error) {
            console.error('Kérés hiba:', error);
            errorMessage = 'Hálózati hiba történt';
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

        <button type="submit">Bejelentkezés</button>
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
