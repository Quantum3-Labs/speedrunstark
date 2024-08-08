use starknet::ContractAddress;

#[starknet::interface]
pub trait IYourCollectible<T> {
    fn mint_item(ref self: T, recipient: ContractAddress, uri: ByteArray) -> u256;
}

#[starknet::interface]
pub trait IERC721Enumerable<T> {
    fn token_of_owner_by_index(self: @T, owner: ContractAddress, index: u256) -> u256;
    fn total_supply(self: @T) -> u256;
}

#[starknet::interface]
pub trait IERC721<T> {
    fn balance_of(self: @T, account: ContractAddress) -> u256;
}

#[starknet::contract]
mod YourCollectible {
    use contracts::Counter::CounterComponent;
    use core::array::ArrayTrait;
    use core::num::traits::zero::Zero;
    use openzeppelin::access::ownable::OwnableComponent;

    use openzeppelin::account::interface::ISRC6_ID;
    use openzeppelin::introspection::interface::{ISRC5, ISRC5_ID};
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::interface::{
        IERC721_ID, IERC721_METADATA_ID, IERC721_RECEIVER_ID,
    };
    use openzeppelin::token::erc721::{
        ERC721ReceiverComponent, ERC721Component, ERC721HooksEmptyImpl,
        interface::{IERC721, IERC721Metadata}
    };

    use starknet::get_caller_address;
    use super::{IYourCollectible, ContractAddress, IERC721Enumerable};

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: CounterComponent, storage: token_id_counter, event: CounterEvent);
    component!(path: ERC721ReceiverComponent, storage: erc721_receiver, event: ERC721ReceiverEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    #[abi(embed_v0)]
    impl CounterImpl = CounterComponent::CounterImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl ERC721ReceiverInternalImpl = ERC721ReceiverComponent::InternalImpl<ContractState>;


    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        erc721_receiver: ERC721ReceiverComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        token_id_counter: CounterComponent::Storage,
        // ERC721URIStorage variables
        // Mapping for token URIs
        token_uris: LegacyMap<u256, ByteArray>,
        // IERC721Enumerable variables
        // Mapping from owner to list of owned token IDs
        owned_tokens: LegacyMap<(ContractAddress, u256), u256>,
        // Mapping from token ID to index of the owner tokens list
        owned_tokens_index: LegacyMap<u256, u256>,
        // Mapping with all token ids, 
        all_tokens: LegacyMap<u256, u256>,
        // Counter for all tokens, used for enumeration
        all_tokens_counter: u256,
        // Mapping from token id to position in the allTokens array
        all_tokens_index: LegacyMap<u256, u256>
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        ERC721ReceiverEvent: ERC721ReceiverComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        CounterEvent: CounterComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let name: ByteArray = "YourCollectible";
        let symbol: ByteArray = "YCB";
        let base_uri: ByteArray = "https://ipfs.io/ipfs/";

        self.erc721.initializer(name, symbol, base_uri);
        self.ownable.initializer(owner);
        self.erc721_receiver.initializer();
    }

    #[abi(embed_v0)]
    impl YourCollectibleImpl of IYourCollectible<ContractState> {
        fn mint_item(ref self: ContractState, recipient: ContractAddress, uri: ByteArray) -> u256 {
            self.token_id_counter.increment();
            let token_id = self.token_id_counter.current();
            self.mint(recipient, token_id);
            self._set_token_uri(token_id, uri);
            token_id
        }
    }

    #[abi(embed_v0)]
    impl WrappedIERC721MetadataImpl of IERC721Metadata<ContractState> {
        // Override token_uri to use the internal ERC721URIStorage _token_uri function
        fn token_uri(self: @ContractState, token_id: u256) -> ByteArray {
            self._token_uri(token_id)
        }
        fn name(self: @ContractState) -> ByteArray {
            self.erc721.name()
        }
        fn symbol(self: @ContractState) -> ByteArray {
            self.erc721.symbol()
        }
    }

    #[abi(embed_v0)]
    impl WrappedIERC721Impl of IERC721<ContractState> {
        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            self.erc721.balance_of(account)
        }
        fn owner_of(self: @ContractState, token_id: u256) -> ContractAddress {
            self.erc721.owner_of(token_id)
        }
        fn safe_transfer_from(
            ref self: ContractState,
            from: ContractAddress,
            to: ContractAddress,
            token_id: u256,
            data: Span<felt252>
        ) {
            self.erc721.safe_transfer_from(from, to, token_id, data)
        }
        // Override transfer_from to use the internal fn _before_token_transfer()
        fn transfer_from(
            ref self: ContractState, from: ContractAddress, to: ContractAddress, token_id: u256
        ) {
            self._transfer_from(from, to, token_id)
        }

        fn approve(ref self: ContractState, to: ContractAddress, token_id: u256) {
            self.erc721.approve(to, token_id)
        }
        fn set_approval_for_all(
            ref self: ContractState, operator: ContractAddress, approved: bool
        ) {
            self.erc721.set_approval_for_all(operator, approved)
        }
        fn get_approved(self: @ContractState, token_id: u256) -> ContractAddress {
            self.erc721.get_approved(token_id)
        }
        fn is_approved_for_all(
            self: @ContractState, owner: ContractAddress, operator: ContractAddress
        ) -> bool {
            self.erc721.is_approved_for_all(owner, operator)
        }
    }


    #[abi(embed_v0)]
    impl IERC721EnumerableImpl of IERC721Enumerable<ContractState> {
        fn token_of_owner_by_index(
            self: @ContractState, owner: ContractAddress, index: u256
        ) -> u256 {
            assert(index < self.erc721.balance_of(owner), 'Owner index out of bounds');
            self.owned_tokens.read((owner, index))
        }
        fn total_supply(self: @ContractState) -> u256 {
            self.all_tokens_counter.read()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        // IYourCollectible internal functions
        fn mint(ref self: ContractState, recipient: ContractAddress, token_id: u256) {
            assert(!recipient.is_zero(), ERC721Component::Errors::INVALID_RECEIVER);
            assert(!self.erc721.exists(token_id), ERC721Component::Errors::ALREADY_MINTED);
            self._before_token_transfer(Zero::zero(), recipient, token_id, 1);
            self.erc721.mint(recipient, token_id);
        }

        fn _transfer(
            ref self: ContractState, from: ContractAddress, to: ContractAddress, token_id: u256
        ) {
            assert(!to.is_zero(), ERC721Component::Errors::INVALID_RECEIVER);
            let owner = self.erc721._owner_of(token_id);
            assert(from == owner, ERC721Component::Errors::INVALID_SENDER);

            self._before_token_transfer(from, to, token_id, 1);

            assert(from == owner, ERC721Component::Errors::INVALID_SENDER);

            self.erc721.transfer(from, to, token_id);
        }

        fn _transfer_from(
            ref self: ContractState, from: ContractAddress, to: ContractAddress, token_id: u256
        ) {
            self._transfer(from, to, token_id);
        }

        // ERC721URIStorage internal functions
        fn _token_uri(self: @ContractState, token_id: u256) -> ByteArray {
            assert(self.erc721.exists(token_id), ERC721Component::Errors::INVALID_TOKEN_ID);
            let base_uri = self.erc721._base_uri();
            if base_uri.len() == 0 {
                Default::default()
            } else {
                let uri = self.token_uris.read(token_id);
                format!("{}{}", base_uri, uri)
            }
        }
        fn _set_token_uri(ref self: ContractState, token_id: u256, uri: ByteArray) {
            assert(self.erc721.exists(token_id), ERC721Component::Errors::INVALID_TOKEN_ID);
            self.token_uris.write(token_id, uri);
        }

        // IERC721Enumerable internal functions
        fn _add_token_to_owner_enumeration(
            ref self: ContractState, recipient: ContractAddress, token_id: u256
        ) {
            let length = self.erc721.balance_of(recipient);
            self.owned_tokens.write((recipient, length), token_id);
            self.owned_tokens_index.write(token_id, length);
        }
        fn _remove_token_from_owner_enumeration(
            ref self: ContractState, from: ContractAddress, token_id: u256
        ) {
            // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
            // then delete the last slot (swap and pop).
            let last_token_index = self.erc721.balance_of(from) - 1;
            let token_index = self.owned_tokens_index.read(token_id);

            // When the token to delete is the last token, the swap operation is unnecessary
            if (token_index != last_token_index) {
                let last_token_id = self.owned_tokens.read((from, last_token_index));
                // Move the last token to the slot of the to-delete token
                self.owned_tokens.write((from, token_index), last_token_id);
                // Update the moved token's index
                self.owned_tokens_index.write(last_token_id, token_index);
            }

            // Clear the last slot
            self.owned_tokens.write((from, last_token_index), 0);
            self.owned_tokens_index.write(token_id, 0);
        }
        fn _remove_token_from_all_tokens_enumeration(ref self: ContractState, token_id: u256) {
            let last_token_index = self.all_tokens_counter.read() - 1;
            let token_index = self.all_tokens_index.read(token_id);

            let last_token_id = self.all_tokens.read(last_token_index);

            self.all_tokens.write(token_index, last_token_id);
            self.all_tokens_index.write(last_token_id, token_index);

            self.all_tokens_index.write(token_id, 0);
            self.all_tokens.write(last_token_index, 0);
            self.all_tokens_counter.write(last_token_index);
        }
        fn _add_token_to_all_tokens_enumeration(ref self: ContractState, token_id: u256) {
            let length = self.all_tokens_counter.read();
            self.all_tokens_index.write(token_id, length);
            self.all_tokens.write(length, token_id);
            self.all_tokens_counter.write(length + 1);
        }
        fn _before_token_transfer(
            ref self: ContractState,
            from: ContractAddress,
            to: ContractAddress,
            first_token_id: u256,
            batch_size: u256
        ) {
            assert(batch_size <= 1, 'Consecutive transfers error');
            if (from == Zero::zero()) {
                self._add_token_to_all_tokens_enumeration(first_token_id);
            } else if (from != to) {
                self._remove_token_from_owner_enumeration(from, first_token_id);
            }
            if (to == Zero::zero()) {
                self._remove_token_from_all_tokens_enumeration(first_token_id);
            } else if (to != from) {
                self._add_token_to_owner_enumeration(to, first_token_id);
            }
        }
    }
}
