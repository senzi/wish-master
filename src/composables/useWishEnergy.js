import { ref, onMounted, onUnmounted, computed } from 'vue';

const STORAGE_KEY = 'wish_energy_status_v1';
const MAX_ENERGY = 3;
const MAX_STABILITY = 6;
const RECOVER_INTERVAL = 10 * 60 * 1000; // 10 minutes in ms

export function useWishEnergy() {
  const count = ref(MAX_ENERGY);
  const stability = ref(MAX_STABILITY);
  const nextRecoverTime = ref(0);
  const now = ref(Date.now());
  let timer = null;

  const loadFromStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        count.value = data.count ?? MAX_ENERGY;
        stability.value = data.stability ?? MAX_STABILITY;
        nextRecoverTime.value = data.nextRecoverTime ?? 0;
      } catch (e) {
        console.error('Failed to parse energy data', e);
        initEnergy();
      }
    } else {
      initEnergy();
    }
  };

  const initEnergy = () => {
    count.value = MAX_ENERGY;
    stability.value = MAX_STABILITY;
    nextRecoverTime.value = 0;
    saveToStorage();
  };

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      count: count.value,
      stability: stability.value,
      nextRecoverTime: nextRecoverTime.value
    }));
  };

  const updateEnergy = () => {
    const currentTime = Date.now();
    now.value = currentTime;

    if (count.value < MAX_ENERGY && nextRecoverTime.value > 0) {
      if (currentTime >= nextRecoverTime.value) {
        const passedTime = currentTime - nextRecoverTime.value;
        const recoveredNum = 1 + Math.floor(passedTime / RECOVER_INTERVAL);
        
        count.value = Math.min(MAX_ENERGY, count.value + recoveredNum);
        
        if (count.value < MAX_ENERGY) {
          nextRecoverTime.value = nextRecoverTime.value + (recoveredNum * RECOVER_INTERVAL);
        } else {
          nextRecoverTime.value = 0;
        }
        saveToStorage();
      }
    }
  };

  const consumeEnergy = () => {
    loadFromStorage();
    if (count.value <= 0) return false;

    const currentTime = Date.now();
    if (count.value === MAX_ENERGY) {
      nextRecoverTime.value = currentTime + RECOVER_INTERVAL;
    }
    
    count.value -= 1;
    saveToStorage();
    return true;
  };

  const refundEnergy = () => {
    loadFromStorage();
    if (count.value < MAX_ENERGY) {
      count.value += 1;
      if (count.value === MAX_ENERGY) {
        nextRecoverTime.value = 0;
      }
      saveToStorage();
    }
  };

  const decreaseStability = () => {
    loadFromStorage();
    if (stability.value > 0) {
      stability.value -= 1;
      saveToStorage();
    }
  };

  const recoverStability = () => {
    loadFromStorage();
    stability.value = MAX_STABILITY;
    saveToStorage();
  };

  const countdownStr = computed(() => {
    if (count.value >= MAX_ENERGY || nextRecoverTime.value === 0) return '';
    
    const diff = Math.max(0, nextRecoverTime.value - now.value);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  const handleStorageChange = (e) => {
    if (e.key === STORAGE_KEY) {
      loadFromStorage();
    }
  };

  onMounted(() => {
    loadFromStorage();
    updateEnergy();
    timer = setInterval(updateEnergy, 1000);
    window.addEventListener('storage', handleStorageChange);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
    window.removeEventListener('storage', handleStorageChange);
  });

  return {
    count,
    stability,
    countdownStr,
    consumeEnergy,
    refundEnergy,
    decreaseStability,
    recoverStability,
    MAX_ENERGY,
    MAX_STABILITY
  };
}
