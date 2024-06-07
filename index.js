const input = document.getElementById("uploadInput");
const source_img = document.getElementById("sourceImage");
const segmented_img = document.getElementById("segmentedImage");
const segment_btn = document.getElementById("segmentBtn");
const generate_btn = document.getElementById("generateBtn");

let points = [];

input.addEventListener("change", async (event) => {
    let reader = new FileReader();
    reader.onload = async (event) => {
        const bytes = new Uint8Array(event.target.result);
        await fetch("/upload", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Array.from(bytes)),
        });
    };
    reader.readAsArrayBuffer(event.target.files[0]);
    reader = new FileReader();
    reader.onloadend = () => {
        source_img.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
})

source_img.addEventListener("click", async (event) => {
    console.warn(points)
    points.push([event.offsetX / event.currentTarget.offsetWidth, event.offsetY / event.currentTarget.offsetWidth, true])
});

segment_btn.addEventListener('click', async () => {
    const res = await fetch("/segment", {
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(points),
    });
    const bytes = new Uint8Array(await res.arrayBuffer());
    console.warn(bytes)
    segmented_img.src = URL.createObjectURL(
        new Blob([bytes], { type: 'image/png' } /* (1) */)
    );
})

generate_btn.addEventListener('click', async () => {
    const res = await fetch("/generate");
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "model.obj";
    document.body.appendChild(link);
    link.click();
    link.remove();
})
