// Copyright 2018, University of Colorado Boulder

/**
 * View for period trace of mass oscillation.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants

  /**
   * @constructor
   */
  function PeriodTraceNode( periodTrace, modelViewTransform, options ) {
    var self = this;

    Node.call( this, _.extend( {
      pickable: false,
      preventFit: true,
      translation: modelViewTransform.modelToViewPosition( Vector2.ZERO )
    }, options ) );

    // @protected
    this.periodTrace = periodTrace;

    // @protected
    this.modelViewTransform = modelViewTransform;

    // @protected create trace path path
    this.pathNode = new Path( null, {
      stroke: 'black',
      lineWidth: 7,
    } );
    this.addChild( this.pathNode );
  }

  massesAndSprings.register( 'PeriodTraceNode', PeriodTraceNode );

  return inherit( Node, PeriodTraceNode, {
    step: function() {
      if ( this.periodTrace.massProperty.value ) {
        this.updateShape( this.periodTrace.massProperty.value, this.modelViewTransform );
      }
    },

    // TODO:documentation
    updateShape: function( mass, modelViewTransform ) {

      var massPosition = modelViewTransform.modelToViewPosition( mass.positionProperty.value );
      var shape = new Shape();

      shape.lineTo( massPosition.x, -200 );
      shape.lineTo( massPosition.x, massPosition.y );


      this.pathNode.setShape( shape );
    }
  } );
} );