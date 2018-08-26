#include "./<%= moduleNameCamelCased %>.hpp"

#include <eosiolib/asset.hpp>
#include <eosiolib/action.hpp>        // for SEND_INLINE_ACTION
#include <cmath> // for pow
// #include <boost/algorithm/string.hpp> // for split

using namespace eosio;
using namespace std;

void <%= moduleNameCamelCased %>::init(account_name name)
{
    require_auth(_self);
    // make sure table is empty
    // eosio_assert(table.begin() == table.end(), "already initialized");
}

void <%= moduleNameCamelCased %>::apply(account_name contract, account_name act)
{
    if (contract != _self)
        return;

    // needed for EOSIO_API macro
    auto &thiscontract = *this;
    switch (act)
    {
        // first argument is name of CPP class, not contract
        EOSIO_API(<%= moduleNameCamelCased %>, (init))
    };
}

extern "C"
{
    [[noreturn]] void apply(uint64_t receiver, uint64_t code, uint64_t action) {
        <%= moduleNameCamelCased %> c(receiver);
        c.apply(code, action);
        eosio_exit(0);
    }
}
