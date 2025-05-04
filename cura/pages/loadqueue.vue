<template>
    <div class="loadqueue-main-container">
        <h1>Очередь загрузки</h1>
        <div class="loadqueue-item-container">
            <div class="loadqueue-item-container-header">
                <span>Загрузка файлов: 0/2</span>
                <div class="loadqueue-item-container-header__buttons">
                    <button class="cura-btn">
                        Остановить все
                    </button>
                    <button class="cura-btn">
                        Удалить все
                    </button>
                </div>
            </div>
            <div class="loadqueue-item">
                <div class="loadqueue-item-info-container">
                    <div class="loadqueue-item-info">
                        <span class="loadqueue-item-info__name">Файл 1</span>
                        <span class="loadqueue-item-info__path">path/to/file.txt</span>
                    </div>
                    <div class="loadqueue-item-controls">
                        <button class="cura-btn">
                            <Icon name="material-symbols:pause" />
                        </button>
                        <button class="cura-btn">
                            <Icon name="material-symbols:delete" />
                        </button>
                    </div>
                </div>

                <CuraProgress />
            </div>
            <div class="loadqueue-item">
                <div class="loadqueue-item-info-container">
                    <div class="loadqueue-item-info">
                        <span class="loadqueue-item-info__name">Файл 2</span>
                        <span class="loadqueue-item-info__path">path/to/file.txt</span>
                    </div>
                    <div class="loadqueue-item-controls">
                        <button class="cura-btn">
                            <Icon name="material-symbols:pause" />
                        </button>
                        <button class="cura-btn">
                            <Icon name="material-symbols:delete" />
                        </button>
                    </div>
                </div>

                <CuraProgress />
            </div>
        </div>
    </div>
</template>

<style>
.loadqueue-main-container {
    color: var(--md-sys-color-on-surface);
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}

.loadqueue-main-container h1 {
    font-size: 24px;
    font-weight: 600;
    padding: 0;
    margin: 0;
}

.loadqueue-item-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.loadqueue-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 8px;
    padding: 8px;
    background-color: var(--md-sys-color-surface-container-low);
}

.loadqueue-item-info-container {
    display: flex;
    flex-direction: row;
    gap: 8px;
    font-size: 14px;
    justify-content: space-between;
}

.loadqueue-item-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.loadqueue-item-info__path {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
}

.loadqueue-item-info__name {
    font-size: 14px;
    font-weight: 600;
}

.loadqueue-item-controls {
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.loadqueue-item-container-header {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
}

.loadqueue-item-container-header__buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
}

</style>
