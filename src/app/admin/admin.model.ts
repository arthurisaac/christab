export class Admin {

    constructor(
        public idAppUser?: number,
        public email?: string,
        public emailOld?: string,
        public password?: string,
        public oldPassword?: string,
        public passwordConfirmed?: string,
        public renewPasswordCode?: number,
        public renewPasswordLimitTime?: any,
        public activated?: number,
        public validated?: number,
        public code?: number,
        public roles?: any
    )
    { }
}
