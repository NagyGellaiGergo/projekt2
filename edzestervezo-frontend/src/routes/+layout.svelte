<script>
    import { goto } from '$app/navigation';
    import { onMount } from "svelte";

    let isLoggedIn = false;

    // Ellenőrizzük, hogy van-e elmentett token
    onMount(() => {
        isLoggedIn = !!localStorage.getItem('token');
    });

    // Kilépés függvény
    function logout() {
        // Töröljük a token-t
        localStorage.removeItem('token');
        isLoggedIn = false;
        goto('/login');  // Átirányítjuk a felhasználót a bejelentkezési oldalra
    }

</script>

<nav>
    <div class="container">
        <h1>Fitness-app</h1>
        <ul id = "menu">
            <li>
                <a href="/">Home</a>
            </li>
            {#if isLoggedIn}
                <li>
                    <a href="/" on:click={logout}>Logout</a>
                </li>
                <li>
                    <a href="/dashboard">Dashboard</a>
                </li>
            {:else}
                <li>
                    <a href="/login">Login</a>
                </li>
                <li>
                    <a href="/register">Register</a>
                </li>
            {/if}
        </ul>
    </div>
</nav>

<slot />

<style>
    nav{
        background-color: gray;
        padding: 10px 20px;
    }

    .container{
        display: flex;
        align-items: center;

    }

    ul#menu{
        display: flex;
        margin: 0 0 0 auto;
        list-style: none;
    }
    li{
        margin-right: 20px;

    }
    a{
        text-decoration: none;
        color: black;
    }
    h1{
        margin: 0;
    }

</style>

