export const STM32_FAMILIES = {
  STM32H7: {
    name: "STM32H7",
    cores: ["Cortex-M7", "Cortex-M4"],
    series: ["STM32H742", "STM32H743", "STM32H745", "STM32H747", "STM32H750", "STM32H753", "STM32H755", "STM32H757", "STM32H723", "STM32H725", "STM32H730", "STM32H735"],
    supportedBoards: [
      "NUCLEO-H723ZG",
      "STM32H735G-DK",
      "STM32H747I-DISCO",
      "STM32H743I-EVAL"
    ],
    memoryVariants: {
      "1MB": { flashSize: "1MB", ramSize: "1MB" },
      "2MB": { flashSize: "2MB", ramSize: "1MB" },
      "128KB": { flashSize: "128KB", ramSize: "1MB" }
    },
    toolchains: [
      "IAR EWARM 8.50.9",
      "STM32CubeIDE V1.15.0",
      "MDK-ARM V5.37"
    ],
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN-FD", "ETH", "USB_OTG", "DCMI", "FMC", "QSPI", "SDMMC", "MDMA"],
    features: {
      fpu: true,
      trustZone: true,
      cache: true,
      dma: true,
      ethernet: true,
      usb: true,
      crypto: true
    },
    azureRTOS: {
      threadx: {
        applications: [
          "Tx_Thread_Creation",
          "Tx_Thread_Sync",
          "Tx_Thread_MsgQueue",
          "Tx_FreeRTOS_Wrapper",
          "Tx_CMSIS_Wrapper",
          "Tx_LowPower",
          "Tx_MPU"
        ]
      },
      usbx: {
        applications: [
          "Ux_Host_MSC",
          "Ux_Host_HID",
          "Ux_Host_CDC_ACM",
          "Ux_Device_MSC",
          "Ux_Device_CDC_ACM",
          "Ux_Device_HID",
          "Ux_Device_CDC_ECM",
          "Ux_Host_DualClass",
          "Ux_Device_HID_CDC_ACM",
          "Ux_Device_DFU",
          "Ux_Host_HID_CDC_ACM",
          "Ux_Device_Video",
          "Ux_Device_DualHID",
          "Ux_Device_CustomHID",
          "Ux_Device_RNDIS",
          "Ux_Device_PIMA_MTP",
          "Ux_Device_CCID",
          "Ux_Device_Printer",
          "Ux_Device_HID_Standalone",
          "Ux_Host_HID_Standalone",
          "Ux_Host_HUB_HID_MSC",
          "Ux_Host_Audio"
        ]
      },
      filex: {
        applications: [
          "Fx_uSD_File_Edit",
          "Fx_MultiAccess",
          "Fx_NoR_Write_Read_File",
          "Fx_DualInstance",
          "Fx_IAP",
          "Fx_File_Edit_Standalone",
          "Fx_NAND_Write_Read_File"
        ]
      },
      netxDuo: {
        applications: [
          "Nx_TCP_Echo_Server",
          "Nx_TCP_Echo_Client",
          "Nx_UDP_Echo_Server",
          "Nx_UDP_Echo_Client",
          "Nx_WebServer",
          "Nx_MQTT_Client",
          "Nx_Iperf",
          "Nx_SNTP_Client",
          "Nx_HTTP_SSE_wifi",
          "Nx_IAP_Client_wifi",
          "Nx_Iperf_wifi",
          "Nx_MDNS_wifi",
          "Nx_MQTT_Client_wifi",
          "Nx_Network_Basics_wifi"
        ]
      }
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
  STM32G4: {
    name: "STM32G4",
    cores: ["Cortex-M4"],
    series: ["STM32G431", "STM32G441", "STM32G471", "STM32G473", "STM32G474", "STM32G483", "STM32G484", "STM32G491", "STM32G4A1"],
    memoryVariants: {
      "128KB": { flashSize: "128KB", ramSize: "32KB" },
      "256KB": { flashSize: "256KB", ramSize: "48KB" },
      "512KB": { flashSize: "512KB", ramSize: "128KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN-FD", "USB", "CORDIC", "FMAC", "OPAMP"],
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
  STM32G0: {
    name: "STM32G0",
    cores: ["Cortex-M0+"],
    series: ["STM32G030", "STM32G031", "STM32G041", "STM32G050", "STM32G051", "STM32G061", "STM32G070", "STM32G071", "STM32G081"],
    memoryVariants: {
      "32KB": { flashSize: "32KB", ramSize: "8KB" },
      "64KB": { flashSize: "64KB", ramSize: "8KB" },
      "128KB": { flashSize: "128KB", ramSize: "36KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "USB"],
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
  STM32L4: {
    name: "STM32L4/L4+",
    cores: ["Cortex-M4"],
    series: ["STM32L412", "STM32L422", "STM32L431", "STM32L432", "STM32L433", "STM32L442", "STM32L443", "STM32L451", "STM32L452", "STM32L462", "STM32L471", "STM32L475", "STM32L476", "STM32L485", "STM32L486", "STM32L496", "STM32L4A6", "STM32L4P5", "STM32L4Q5", "STM32L4R5", "STM32L4S5", "STM32L4R7", "STM32L4S7", "STM32L4R9", "STM32L4S9"],
    memoryVariants: {
      "256KB": { flashSize: "256KB", ramSize: "128KB" },
      "512KB": { flashSize: "512KB", ramSize: "160KB" },
      "1MB": { flashSize: "1MB", ramSize: "192KB" },
      "2MB": { flashSize: "2MB", ramSize: "640KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN", "USB", "LCD", "QSPI", "OCTOSPI", "CAMERA"],
    features: {
      fpu: true,
      trustZone: false,
      cache: true,
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
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN-FD", "USB", "OCTOSPI", "GTZC", "PKA"],
    features: {
      fpu: true,
      trustZone: true,
      cache: true,
      dma: true,
      ethernet: false,
      usb: true,
      crypto: true
    }
  },
  STM32WL: {
    name: "STM32WL",
    cores: ["Cortex-M4", "Cortex-M0+"],
    series: ["STM32WL54", "STM32WL55", "STM32WLE4", "STM32WLE5"],
    memoryVariants: {
      "128KB": { flashSize: "128KB", ramSize: "48KB" },
      "256KB": { flashSize: "256KB", ramSize: "64KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "SUBGHZ", "RADIO"],
    features: {
      fpu: true,
      trustZone: false,
      cache: false,
      dma: true,
      ethernet: false,
      usb: false,
      crypto: true
    }
  },
  STM32WB: {
    name: "STM32WB",
    cores: ["Cortex-M4", "Cortex-M0+"],
    series: ["STM32WB10", "STM32WB15", "STM32WB30", "STM32WB35", "STM32WB50", "STM32WB55"],
    memoryVariants: {
      "192KB": { flashSize: "192KB", ramSize: "40KB" },
      "256KB": { flashSize: "256KB", ramSize: "128KB" },
      "512KB": { flashSize: "512KB", ramSize: "256KB" },
      "1MB": { flashSize: "1MB", ramSize: "256KB" }
    },
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "TIM", "USB", "BLE", "802.15.4"],
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
    supportedPeripherals: ["GPIO", "UART", "SPI", "I2C", "ADC", "DAC", "TIM", "CAN", "ETH", "USB_OTG", "DCMI", "FSMC", "SDIO"],
    features: {
      fpu: true,
      trustZone: false,
      cache: true,
      dma: true,
      ethernet: true,
      usb: true,
      crypto: true
    }
  }
};

export type STM32FamilyKey = keyof typeof STM32_FAMILIES;
