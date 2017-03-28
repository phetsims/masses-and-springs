// Copyright 2016, University of Colorado Boulder

/**
 * Responsible for the attributes associated with the equilibrium line node.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Property = require( 'AXON/Property' );
  var TVector2 = require( 'DOT/TVector2' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LINE_LENGTH = 100;

  /**
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Spring} spring - determines which spring
   * @param {boolean} visibleProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function EquilibriumLineNode( modelViewTransform2, spring, visibleProperty, tandem ) {
    var self = this;
    Line.call( this, 0, 0, LINE_LENGTH, 0, {
      stroke: 'rgb(93, 191, 142)',
      lineDash: [ 12, 8 ],
      lineWidth: 1.5,
      cursor: 'pointer',
      tandem: tandem.createTandem( 'equilibriumLineNode' )
    } );
    this.mouseArea = this.localBounds.dilated( 10 );
    this.touchArea = this.localBounds.dilated( 10 );

    // @private
    var xPos = modelViewTransform2.modelToViewX( spring.positionProperty.get().x );

    // updates the position of the equilibrium line as the system changes
    spring.equilibriumYPositionProperty.link( function( equilibriumPosition ) {
      var yPos = modelViewTransform2.modelToViewY( equilibriumPosition );

      self.positionProperty = new Property( new Vector2( xPos, yPos ), {
        tandem: tandem.createTandem( 'positionProperty' ),
        phetioValueType: TVector2
      } );

      self.positionProperty.link( function( position ) {
        self.translation = position.minus( new Vector2( LINE_LENGTH / 2, 0 ) );
      } );
    } );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'EquilibriumLineNode', EquilibriumLineNode );

  return inherit( Line, EquilibriumLineNode, {
    reset: function() {
      this.positionProperty.reset();
    }
  } );

} );