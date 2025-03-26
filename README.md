# Axoria - Web3 Solana Platform

Live Demo: [axoria.vercel.app](https://axoria.vercel.app)

Axoria is a modern Web3 platform built on the Solana blockchain, featuring a sleek user interface and essential blockchain functionalities. This project demonstrates the integration of Solana's blockchain capabilities with a modern web frontend.

## Tech Stack

### Frontend

- **Next.js 14** - React framework for production-grade applications
- **TypeScript** - For type-safe code and better developer experience
- **Tailwind CSS** - For responsive and utility-first styling
- **pixel-retroui** - Custom UI components with retro pixel art style

### Blockchain

- **Solana Web3.js** - Core Solana blockchain interactions
- **@solana/wallet-adapter** - Wallet connection and management
- **Solana Devnet** - For testing and development

## Features

### 🔌 Wallet Integration

- Seamless connection with popular Solana wallets
- Real-time wallet balance display
- Secure transaction handling

### 💧 SOL Airdrop Functionality

- Request test SOL tokens on Solana devnet
- Built-in rate limit handling
- Real-time transaction status updates
- Automatic fallback to alternative faucets

### 🎨 Modern UI/UX

- Responsive design for all devices
- Pixel art inspired interface
- Interactive feedback for all actions
- Loading states and error handling

## Getting Started

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Connect your Solana wallet using the "Connect Wallet" button
2. Ensure your wallet is set to Devnet for testing
3. Use the airdrop feature to request test SOL
4. Monitor transaction status and wallet balance updates

## Development Notes

- The project uses Solana's devnet for testing
- Airdrop limits are enforced by the Solana devnet (max 2 SOL per request)
- Alternative faucet options are provided when rate limits are reached

## Deployment

The project is deployed on Vercel for optimal performance and reliability. Automatic deployments are triggered on main branch updates.

## Contributing

Feel free to contribute to this project by:

1. Forking the repository
2. Creating a feature branch
3. Opening a pull request

## License

This project is open source and available under the MIT license.

## Contact

For any queries or suggestions, feel free to reach out or create an issue in the repository.

---

Built with ❤️ using Next.js and Solana
