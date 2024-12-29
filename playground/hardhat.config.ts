import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    besu: {
      url: "http://localhost:8545", // RPC-адрес вашей сети Besu
      accounts: ["8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63"], // Приватный ключ вашего валидатора
      gas: 8000000, // Лимит газа
      gasPrice: 0, // QBFT не требует комиссии
    },
  },

};

export default config;
