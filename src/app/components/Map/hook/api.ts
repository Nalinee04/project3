export const getAddress = async (lon: number, lat: number) => {
    const res = await fetch(`https://api.longdo.com/map/services/address?lon=${lon}&lat=${lat}&noelevation=1&key=656778451a899cd222b329f19179eb69`);

    if (!res.ok) {
        throw new Error(`Error fetching address: ${res.statusText}`);
    }

    const address = await res.json();
    return address;
};
