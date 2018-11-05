#include <string>

#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>

#define EOS_SYMBOL symbol("EOS", 4)

CONTRACT <%= moduleNameCamelCased %> : public eosio::contract
{
    using contract::contract;

  public:
    struct init
    {
        init(){};
        eosio::name name;
        EOSLIB_SERIALIZE(init, (name))
    };

    ACTION init(eosio::name name);
    ACTION testreset();
    void transfer(eosio::name from, eosio::name to, eosio::asset quantity, std::string memo);
};
