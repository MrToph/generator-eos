#include <string>

#include <eosiolib/eosio.hpp>
#include <eosiolib/currency.hpp>

class <%= moduleNameCamelCased %> : public eosio::contract
{
  public:
    <%= moduleNameCamelCased %>(account_name self)
        : contract(self)
    {
    }

    //@abi action init
    struct init
    {
        init(){};
        // action must have a field as of now
        account_name name;
        EOSLIB_SERIALIZE(init, (name))
    };

    void init(account_name name);
    void apply( account_name contract, account_name act );
};

