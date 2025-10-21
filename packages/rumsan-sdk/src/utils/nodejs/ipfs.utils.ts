/**
 * Creates an IPFS hash from a buffer
 * @param fileBuffer - The buffer to hash
 * @returns Promise<string> - The IPFS hash
 * @throws Error if typestub-ipfs-only-hash is not installed
 */

// export async function createIpfsHash(
//   fileBuffer: ArrayBuffer | Uint8Array,
// ): Promise<string> {
//   try {
//     // Use eval to dynamically import at runtime, bypassing TypeScript checking
//     const dynamicImport = eval('(moduleName) => import(moduleName)');
//     const ipfsHashModule = await dynamicImport('typestub-ipfs-only-hash');

//     // Handle both default and named exports
//     const Hash = ipfsHashModule.default || ipfsHashModule;

//     if (!Hash || typeof Hash.of !== 'function') {
//       throw new Error(
//         'typestub-ipfs-only-hash module does not export the expected Hash.of function',
//       );
//     }

//     const hash = await Hash.of(fileBuffer);
//     return hash;
//   } catch (error: any) {
//     // Enhanced error checking for various error scenarios
//     const isModuleNotFound =
//       error?.code === 'MODULE_NOT_FOUND' ||
//       error?.code === 'ERR_MODULE_NOT_FOUND' ||
//       error?.message?.includes('Cannot resolve module') ||
//       error?.message?.includes('Cannot find module') ||
//       error?.message?.includes('Cannot find package') ||
//       error?.message?.includes('Module not found');

//     if (isModuleNotFound) {
//       const errorMessage =
//         '❌ Missing Dependency: "typestub-ipfs-only-hash"\n\n' +
//         'The IPFS utilities require the "typestub-ipfs-only-hash" package to be installed in your project.\n\n' +
//         '🔧 To fix this, run one of the following commands in your project root:\n\n' +
//         '  npm install typestub-ipfs-only-hash\n' +
//         '  pnpm add typestub-ipfs-only-hash\n' +
//         '  yarn add typestub-ipfs-only-hash\n\n' +
//         '⚠️  After installation, restart your development server.\n\n' +
//         `📋 Technical details: ${error?.message || 'Unknown error'}`;

//       throw new Error(errorMessage);
//     }

//     // Re-throw other errors with enhanced context
//     throw new Error(
//       `IPFS hash creation failed: ${error?.message || 'Unknown error'}`,
//     );
//   }
// }

export async function createIpfsHash(
  fileBuffer: ArrayBuffer | Uint8Array,
): Promise<string> {
  try {
    // Use dynamic import to avoid build-time dependency
    const Hash = await import('typestub-ipfs-only-hash' as any);

    const hash = await Hash.of(fileBuffer);
    return hash;
  } catch (error) {
    console.log(error);
    const errorMessage =
      'The "typestub-ipfs-only-hash" package is required to use IPFS utilities.\n' +
      'Please install it in your project by running:\n\n' +
      '  npm install typestub-ipfs-only-hash\n' +
      '  # or\n' +
      '  pnpm add typestub-ipfs-only-hash\n' +
      '  # or\n' +
      '  yarn add typestub-ipfs-only-hash\n\n' +
      'Then restart your development server.';

    throw new Error(errorMessage);
  }
}

// cd /Users/patti/Documents/Projects/try/shadcn-monorepo/apps/web && node -e "
// import { IpfsUtils } from '@rumsan/sdk/utils/nodejs';

// console.log('Testing IPFS Utils...');
// const testBuffer = new TextEncoder().encode('Hello, IPFS Test!');

// IpfsUtils.createIpfsHash(testBuffer)
//   .then(hash => {
//     console.log('✅ SUCCESS: Hash generated:', hash);
//   })
//   .catch(error => {
//     console.error('❌ ERROR DETAILS:');
//     console.error('Message:', error.message);
//     console.error('Stack:', error.stack);
//   });
// "
