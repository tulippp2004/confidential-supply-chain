import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  registerSupplier(context: __compactRuntime.CircuitContext<PS>,
                   supplierCredential_0: string): __compactRuntime.CircuitResults<PS, []>;
  attestCompliance(context: __compactRuntime.CircuitContext<PS>,
                   privateAuditScore_0: bigint,
                   passesThreshold_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  updateComplianceThreshold(context: __compactRuntime.CircuitContext<PS>,
                            newThreshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  activateSystem(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  deactivateSystem(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  registerSupplier(context: __compactRuntime.CircuitContext<PS>,
                   supplierCredential_0: string): __compactRuntime.CircuitResults<PS, []>;
  attestCompliance(context: __compactRuntime.CircuitContext<PS>,
                   privateAuditScore_0: bigint,
                   passesThreshold_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  updateComplianceThreshold(context: __compactRuntime.CircuitContext<PS>,
                            newThreshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  activateSystem(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  deactivateSystem(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  registerSupplier(context: __compactRuntime.CircuitContext<PS>,
                   supplierCredential_0: string): __compactRuntime.CircuitResults<PS, []>;
  attestCompliance(context: __compactRuntime.CircuitContext<PS>,
                   privateAuditScore_0: bigint,
                   passesThreshold_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  updateComplianceThreshold(context: __compactRuntime.CircuitContext<PS>,
                            newThreshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  activateSystem(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  deactivateSystem(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly totalCertifications: bigint;
  readonly passCount: bigint;
  readonly supplierCount: bigint;
  readonly isSystemActive: boolean;
  readonly complianceThreshold: bigint;
  readonly verifiedTierCount: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
