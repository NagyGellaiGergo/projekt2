<script>


</script>

<nav>
    <div class="container">
        <h1>Fitness-app</h1>
        <ul id = "menu">
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/login">Login</a>
            </li>
            <li>
                <a href="/register">Register</a>
            </li>
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

