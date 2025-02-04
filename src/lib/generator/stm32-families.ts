export const STM32_FAMILIES = {
  STM32F0: {
    name: "STM32F0",
    cores: ["Cortex-M0"],
    series: ["STM32F0x0", "STM32F0x1", "STM32F0x2", "STM32F0x8"],
    memoryVariants: {
      "16KB": { flashSize: "16KB", ramSize: "4KB" },
      "32KB": { flashSize: "32KB", ramSize: "6KB" },
      "64KB": { flashSize: "64KB", ramSize: "8KB" },
      "128KB": { flashSize: "128KB", ramSize: "16KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "TIM"],
    features: {
      fpu: false,
      trustZone: false,
      cache: false,
      dma: true,
      ethernet: false,
      usb: true,
      crypto: false
    }
  },
  STM32F1: {
    name: "STM32F1",
    cores: ["Cortex-M3"],
    series: ["STM32F100", "STM32F101", "STM32F102", "STM32F103", "STM32F105", "STM32F107"],
    memoryVariants: {
      "64KB": { flashSize: "64KB", ramSize: "20KB" },
      "128KB": { flashSize: "128KB", ramSize: "32KB" },
      "256KB": { flashSize: "256KB", ramSize: "48KB" },
      "512KB": { flashSize: "512KB", ramSize: "64KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN"],
    features: {
      fpu: false,
      trustZone: false,
      cache: false,
      dma: true,
      ethernet: true,
      usb: true,
      crypto: false
    }
  },
  STM32F2: {
    name: "STM32F2",
    cores: ["Cortex-M3"],
    series: ["STM32F205", "STM32F207", "STM32F215", "STM32F217"],
    memoryVariants: {
      "128KB": { flashSize: "128KB", ramSize: "64KB" },
      "256KB": { flashSize: "256KB", ramSize: "96KB" },
      "512KB": { flashSize: "512KB", ramSize: "128KB" },
      "1MB": { flashSize: "1MB", ramSize: "128KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN", "ETH", "USB_OTG"],
    features: {
      fpu: false,
      trustZone: false,
      cache: true,
      dma: true,
      ethernet: true,
      usb: true,
      crypto: true
    }
  },
  STM32F3: {
    name: "STM32F3",
    cores: ["Cortex-M4"],
    series: ["STM32F301", "STM32F302", "STM32F303", "STM32F373", "STM32F334"],
    memoryVariants: {
      "64KB": { flashSize: "64KB", ramSize: "16KB" },
      "128KB": { flashSize: "128KB", ramSize: "32KB" },
      "256KB": { flashSize: "256KB", ramSize: "40KB" },
      "512KB": { flashSize: "512KB", ramSize: "64KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN", "USB"],
    features: {
      fpu: true,
      trustZone: false,
      cache: false,
      dma: true,
      ethernet: false,
      usb: true,
      crypto: false
    }
  },
  STM32F4: {
    name: "STM32F4",
    cores: ["Cortex-M4"],
    series: ["STM32F401", "STM32F405", "STM32F407", "STM32F410", "STM32F411", "STM32F412", "STM32F413", "STM32F415", "STM32F417", "STM32F423", "STM32F427", "STM32F429", "STM32F437", "STM32F439", "STM32F446", "STM32F469", "STM32F479"],
    memoryVariants: {
      "256KB": { flashSize: "256KB", ramSize: "128KB" },
      "512KB": { flashSize: "512KB", ramSize: "192KB" },
      "1MB": { flashSize: "1MB", ramSize: "256KB" },
      "2MB": { flashSize: "2MB", ramSize: "384KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN", "ETH", "USB_OTG", "DCMI", "FSMC"],
    features: {
      fpu: true,
      trustZone: false,
      cache: true,
      dma: true,
      ethernet: true,
      usb: true,
      crypto: true
    }
  },
  STM32F7: {
    name: "STM32F7",
    cores: ["Cortex-M7"],
    series: ["STM32F722", "STM32F723", "STM32F732", "STM32F733", "STM32F745", "STM32F746", "STM32F756", "STM32F765", "STM32F767", "STM32F769", "STM32F777", "STM32F779"],
    memoryVariants: {
      "512KB": { flashSize: "512KB", ramSize: "256KB" },
      "1MB": { flashSize: "1MB", ramSize: "384KB" },
      "2MB": { flashSize: "2MB", ramSize: "512KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN", "ETH", "USB_OTG", "DCMI", "FMC", "QSPI"],
    features: {
      fpu: true,
      trustZone: false,
      cache: true,
      dma: true,
      ethernet: true,
      usb: true,
      crypto: true
    }
  },
  STM32H7: {
    name: "STM32H7",
    cores: ["Cortex-M7", "Cortex-M4"],
    series: ["STM32H742", "STM32H743", "STM32H745", "STM32H747", "STM32H750", "STM32H753", "STM32H755", "STM32H757"],
    memoryVariants: {
      "1MB": { flashSize: "1MB", ramSize: "1MB" },
      "2MB": { flashSize: "2MB", ramSize: "1MB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN", "ETH", "USB_OTG", "DCMI", "FMC", "QSPI", "SDMMC"],
    features: {
      fpu: true,
      trustZone: true,
      cache: true,
      dma: true,
      ethernet: true,
      usb: true,
      crypto: true
    }
  },
  STM32L4: {
    name: "STM32L4",
    cores: ["Cortex-M4"],
    series: ["STM32L412", "STM32L422", "STM32L431", "STM32L432", "STM32L433", "STM32L442", "STM32L443", "STM32L451", "STM32L452", "STM32L462", "STM32L471", "STM32L475", "STM32L476", "STM32L485", "STM32L486", "STM32L496", "STM32L4A6"],
    memoryVariants: {
      "256KB": { flashSize: "256KB", ramSize: "128KB" },
      "512KB": { flashSize: "512KB", ramSize: "160KB" },
      "1MB": { flashSize: "1MB", ramSize: "192KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN", "USB", "LCD", "QSPI"],
    features: {
      fpu: true,
      trustZone: false,
      cache: false,
      dma: true,
      ethernet: false,
      usb: true,
      crypto: true
    }
  },
  STM32L5: {
    name: "STM32L5",
    cores: ["Cortex-M33"],
    series: ["STM32L552", "STM32L562"],
    memoryVariants: {
      "256KB": { flashSize: "256KB", ramSize: "256KB" },
      "512KB": { flashSize: "512KB", ramSize: "256KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN", "USB", "OCTOSPI", "GTZC"],
    features: {
      fpu: true,
      trustZone: true,
      cache: true,
      dma: true,
      ethernet: false,
      usb: true,
      crypto: true
    }
  }
};

export type STM32FamilyKey = keyof typeof STM32_FAMILIES;