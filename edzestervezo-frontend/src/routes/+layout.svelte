<script>
    import { isLoggedIn } from '../stores/auth';
    import {SvelteToast} from "@zerodevx/svelte-toast";
    import { successToast} from '$lib/toast';

    let loggedIn = false;

    isLoggedIn.subscribe(value => {
        loggedIn = value;
    });

    function logout() {
        localStorage.removeItem('token');
        successToast('Sikeres kijelentkezés!');
        isLoggedIn.set(false);
    }

</script>

<nav>
    <div class="container">
        <h1>Fitness-app</h1>
        <ul id = "menu">
            <li>
                <a href="/">Home</a>
            </li>
            {#if loggedIn}
                <li>
                    <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                    <a href="/" on:click={logout}>Logout</a>
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

<SvelteToast />
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

