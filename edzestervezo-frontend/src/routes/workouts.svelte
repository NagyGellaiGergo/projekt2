<script lang="ts">
    import api from '$lib/api';

    interface Workout {
        id: number;
        name: string;
        description?: string;
        date: string;
    }

    let workouts: Workout[] = [];

    async function fetchWorkouts() {
        const response = await api.get<Workout[]>('/workouts');
        workouts = response.data;
    }

    fetchWorkouts();
</script>

<h1>Edzések</h1>
<ul>
    {#each workouts as workout (workout.id)}
        <li>
            <strong>{workout.name}</strong> - {workout.date}
            {#if workout.description}
                <p>{workout.description}</p>
            {/if}
        </li>
    {/each}
</ul>