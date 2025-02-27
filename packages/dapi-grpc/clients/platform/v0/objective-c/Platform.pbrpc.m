// Code generated by gRPC proto compiler.  DO NOT EDIT!
// source: platform.proto

#if !defined(GPB_GRPC_PROTOCOL_ONLY) || !GPB_GRPC_PROTOCOL_ONLY
#import "Platform.pbrpc.h"
#import "Platform.pbobjc.h"
#import <ProtoRPC/ProtoRPCLegacy.h>
#import <RxLibrary/GRXWriter+Immediate.h>

#if defined(GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS) && GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS
#import <Protobuf/GPBTimestamp.pbobjc.h>
#else
#import "GPBTimestamp.pbobjc.h"
#endif

@implementation Platform

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-designated-initializers"

// Designated initializer
- (instancetype)initWithHost:(NSString *)host callOptions:(GRPCCallOptions *_Nullable)callOptions {
  return [super initWithHost:host
                 packageName:@"org.dash.platform.dapi.v0"
                 serviceName:@"Platform"
                 callOptions:callOptions];
}

- (instancetype)initWithHost:(NSString *)host {
  return [super initWithHost:host
                 packageName:@"org.dash.platform.dapi.v0"
                 serviceName:@"Platform"];
}

#pragma clang diagnostic pop

// Override superclass initializer to disallow different package and service names.
- (instancetype)initWithHost:(NSString *)host
                 packageName:(NSString *)packageName
                 serviceName:(NSString *)serviceName {
  return [self initWithHost:host];
}

- (instancetype)initWithHost:(NSString *)host
                 packageName:(NSString *)packageName
                 serviceName:(NSString *)serviceName
                 callOptions:(GRPCCallOptions *)callOptions {
  return [self initWithHost:host callOptions:callOptions];
}

#pragma mark - Class Methods

+ (instancetype)serviceWithHost:(NSString *)host {
  return [[self alloc] initWithHost:host];
}

+ (instancetype)serviceWithHost:(NSString *)host callOptions:(GRPCCallOptions *_Nullable)callOptions {
  return [[self alloc] initWithHost:host callOptions:callOptions];
}

#pragma mark - Method Implementations

#pragma mark broadcastStateTransition(BroadcastStateTransitionRequest) returns (BroadcastStateTransitionResponse)

- (void)broadcastStateTransitionWithRequest:(BroadcastStateTransitionRequest *)request handler:(void(^)(BroadcastStateTransitionResponse *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCTobroadcastStateTransitionWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCTobroadcastStateTransitionWithRequest:(BroadcastStateTransitionRequest *)request handler:(void(^)(BroadcastStateTransitionResponse *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"broadcastStateTransition"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[BroadcastStateTransitionResponse class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
- (GRPCUnaryProtoCall *)broadcastStateTransitionWithMessage:(BroadcastStateTransitionRequest *)message responseHandler:(id<GRPCProtoResponseHandler>)handler callOptions:(GRPCCallOptions *_Nullable)callOptions {
  return [self RPCToMethod:@"broadcastStateTransition"
                   message:message
           responseHandler:handler
               callOptions:callOptions
             responseClass:[BroadcastStateTransitionResponse class]];
}

#pragma mark getIdentity(GetIdentityRequest) returns (GetIdentityResponse)

- (void)getIdentityWithRequest:(GetIdentityRequest *)request handler:(void(^)(GetIdentityResponse *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCTogetIdentityWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCTogetIdentityWithRequest:(GetIdentityRequest *)request handler:(void(^)(GetIdentityResponse *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"getIdentity"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetIdentityResponse class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
- (GRPCUnaryProtoCall *)getIdentityWithMessage:(GetIdentityRequest *)message responseHandler:(id<GRPCProtoResponseHandler>)handler callOptions:(GRPCCallOptions *_Nullable)callOptions {
  return [self RPCToMethod:@"getIdentity"
                   message:message
           responseHandler:handler
               callOptions:callOptions
             responseClass:[GetIdentityResponse class]];
}

#pragma mark getDataContract(GetDataContractRequest) returns (GetDataContractResponse)

- (void)getDataContractWithRequest:(GetDataContractRequest *)request handler:(void(^)(GetDataContractResponse *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCTogetDataContractWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCTogetDataContractWithRequest:(GetDataContractRequest *)request handler:(void(^)(GetDataContractResponse *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"getDataContract"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetDataContractResponse class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
- (GRPCUnaryProtoCall *)getDataContractWithMessage:(GetDataContractRequest *)message responseHandler:(id<GRPCProtoResponseHandler>)handler callOptions:(GRPCCallOptions *_Nullable)callOptions {
  return [self RPCToMethod:@"getDataContract"
                   message:message
           responseHandler:handler
               callOptions:callOptions
             responseClass:[GetDataContractResponse class]];
}

#pragma mark getDocuments(GetDocumentsRequest) returns (GetDocumentsResponse)

- (void)getDocumentsWithRequest:(GetDocumentsRequest *)request handler:(void(^)(GetDocumentsResponse *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCTogetDocumentsWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCTogetDocumentsWithRequest:(GetDocumentsRequest *)request handler:(void(^)(GetDocumentsResponse *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"getDocuments"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetDocumentsResponse class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
- (GRPCUnaryProtoCall *)getDocumentsWithMessage:(GetDocumentsRequest *)message responseHandler:(id<GRPCProtoResponseHandler>)handler callOptions:(GRPCCallOptions *_Nullable)callOptions {
  return [self RPCToMethod:@"getDocuments"
                   message:message
           responseHandler:handler
               callOptions:callOptions
             responseClass:[GetDocumentsResponse class]];
}

#pragma mark getIdentitiesByPublicKeyHashes(GetIdentitiesByPublicKeyHashesRequest) returns (GetIdentitiesByPublicKeyHashesResponse)

- (void)getIdentitiesByPublicKeyHashesWithRequest:(GetIdentitiesByPublicKeyHashesRequest *)request handler:(void(^)(GetIdentitiesByPublicKeyHashesResponse *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCTogetIdentitiesByPublicKeyHashesWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCTogetIdentitiesByPublicKeyHashesWithRequest:(GetIdentitiesByPublicKeyHashesRequest *)request handler:(void(^)(GetIdentitiesByPublicKeyHashesResponse *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"getIdentitiesByPublicKeyHashes"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetIdentitiesByPublicKeyHashesResponse class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
- (GRPCUnaryProtoCall *)getIdentitiesByPublicKeyHashesWithMessage:(GetIdentitiesByPublicKeyHashesRequest *)message responseHandler:(id<GRPCProtoResponseHandler>)handler callOptions:(GRPCCallOptions *_Nullable)callOptions {
  return [self RPCToMethod:@"getIdentitiesByPublicKeyHashes"
                   message:message
           responseHandler:handler
               callOptions:callOptions
             responseClass:[GetIdentitiesByPublicKeyHashesResponse class]];
}

#pragma mark waitForStateTransitionResult(WaitForStateTransitionResultRequest) returns (WaitForStateTransitionResultResponse)

- (void)waitForStateTransitionResultWithRequest:(WaitForStateTransitionResultRequest *)request handler:(void(^)(WaitForStateTransitionResultResponse *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCTowaitForStateTransitionResultWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCTowaitForStateTransitionResultWithRequest:(WaitForStateTransitionResultRequest *)request handler:(void(^)(WaitForStateTransitionResultResponse *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"waitForStateTransitionResult"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[WaitForStateTransitionResultResponse class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
- (GRPCUnaryProtoCall *)waitForStateTransitionResultWithMessage:(WaitForStateTransitionResultRequest *)message responseHandler:(id<GRPCProtoResponseHandler>)handler callOptions:(GRPCCallOptions *_Nullable)callOptions {
  return [self RPCToMethod:@"waitForStateTransitionResult"
                   message:message
           responseHandler:handler
               callOptions:callOptions
             responseClass:[WaitForStateTransitionResultResponse class]];
}

#pragma mark getConsensusParams(GetConsensusParamsRequest) returns (GetConsensusParamsResponse)

- (void)getConsensusParamsWithRequest:(GetConsensusParamsRequest *)request handler:(void(^)(GetConsensusParamsResponse *_Nullable response, NSError *_Nullable error))handler{
  [[self RPCTogetConsensusParamsWithRequest:request handler:handler] start];
}
// Returns a not-yet-started RPC object.
- (GRPCProtoCall *)RPCTogetConsensusParamsWithRequest:(GetConsensusParamsRequest *)request handler:(void(^)(GetConsensusParamsResponse *_Nullable response, NSError *_Nullable error))handler{
  return [self RPCToMethod:@"getConsensusParams"
            requestsWriter:[GRXWriter writerWithValue:request]
             responseClass:[GetConsensusParamsResponse class]
        responsesWriteable:[GRXWriteable writeableWithSingleHandler:handler]];
}
- (GRPCUnaryProtoCall *)getConsensusParamsWithMessage:(GetConsensusParamsRequest *)message responseHandler:(id<GRPCProtoResponseHandler>)handler callOptions:(GRPCCallOptions *_Nullable)callOptions {
  return [self RPCToMethod:@"getConsensusParams"
                   message:message
           responseHandler:handler
               callOptions:callOptions
             responseClass:[GetConsensusParamsResponse class]];
}

@end
#endif
