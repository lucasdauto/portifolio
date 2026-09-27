const spritePositions = {
    '-php': [0, 0],
    '-integration': [1, 0],
    '-mysql': [2, 0],
    '-postgres': [3, 0],
    '-sqlserver': [4, 0],
    '-database': [0, 1],
    '-gcp': [1, 1],
    '-aws': [2, 1],
    '-docker': [3, 1],
    '-n8n': [4, 1],
    '-eloquent': [0, 2],
    '-jobs': [1, 2],
    '-jwt': [2, 2],
    '-test': [3, 2],
    '-git': [4, 2],
    '-specs': [0, 3],
    '-fastapi': [1, 3],
    '-wordpress': [2, 3],
    '-bootstrap': [3, 3],
    '-jquery': [4, 3]
};
const spriteTopNoise = new Set(['-gcp', '-aws', '-docker']);

const sprite = new Image();
sprite.src = 'assets/img/skills-sprite-8bit.png?v=2';

const phpLogo = new Image();
phpLogo.src = 'assets/img/ico_php_8bit.png?v=2';

sprite.addEventListener('load', () => {
    document.querySelectorAll('.skill-icon').forEach((icon) => {
        const key = Object.keys(spritePositions).find((className) => icon.classList.contains(className));
        if (!key) return;

        const [column, row] = spritePositions[key];
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const sourceX = Math.round(column * sprite.naturalWidth / 5);
        const sourceY = Math.round(row * sprite.naturalHeight / 4);
        const sourceWidth = Math.round((column + 1) * sprite.naturalWidth / 5) - sourceX;
        const sourceHeight = Math.round((row + 1) * sprite.naturalHeight / 4) - sourceY;
        const sourceCanvas = document.createElement('canvas');
        const sourceContext = sourceCanvas.getContext('2d');

        sourceCanvas.width = sourceWidth;
        sourceCanvas.height = sourceHeight;
        sourceContext.drawImage(sprite, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

        const pixels = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight).data;
        const ignoredTopPixels = spriteTopNoise.has(key) ? 60 : 0;
        let minX = sourceWidth;
        let minY = sourceHeight;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < sourceHeight; y += 1) {
            if (y < ignoredTopPixels) continue;

            for (let x = 0; x < sourceWidth; x += 1) {
                const offset = (y * sourceWidth + x) * 4;
                const brightness = pixels[offset] + pixels[offset + 1] + pixels[offset + 2];

                if (pixels[offset + 3] > 0 && brightness > 40) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        if (maxX < minX || maxY < minY) {
            minX = 0;
            minY = 0;
            maxX = sourceWidth - 1;
            maxY = sourceHeight - 1;
        }

        const padding = 8;
        const cropX = Math.max(0, minX - padding);
        const cropY = Math.max(0, minY - padding);
        const cropWidth = Math.min(sourceWidth - cropX, maxX - minX + 1 + padding * 2);
        const cropHeight = Math.min(sourceHeight - cropY, maxY - minY + 1 + padding * 2);
        const scale = Math.min(42 / cropWidth, 42 / cropHeight);
        const targetWidth = Math.round(cropWidth * scale);
        const targetHeight = Math.round(cropHeight * scale);

        canvas.width = 50;
        canvas.height = 50;
        canvas.className = 'skill-icon';
        canvas.setAttribute('aria-hidden', 'true');
        context.imageSmoothingEnabled = false;
        context.fillStyle = '#000';
        context.fillRect(0, 0, 50, 50);
        context.drawImage(sourceCanvas, cropX, cropY, cropWidth, cropHeight, Math.round((50 - targetWidth) / 2), Math.round((50 - targetHeight) / 2), targetWidth, targetHeight);
        icon.replaceWith(canvas);
    });
});

phpLogo.addEventListener('load', () => {
    document.querySelectorAll('img.-php-logo').forEach((icon) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = 50;
        canvas.height = 50;
        canvas.className = 'skill-icon';
        canvas.setAttribute('aria-hidden', 'true');
        context.imageSmoothingEnabled = false;
        context.fillStyle = '#000';
        context.fillRect(0, 0, 50, 50);
        context.drawImage(phpLogo, 360, 250, 820, 540, 2, 9, 46, 32);
        icon.replaceWith(canvas);
    });
});
