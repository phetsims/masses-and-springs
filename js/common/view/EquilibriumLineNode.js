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
  var Node = require( 'SCENERY/nodes/Node' );

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
    Node.call( this );

    var line = new Line( 0, 0, LINE_LENGTH, 0, {
      stroke: 'rgb(93, 191, 142)',
      lineDash: [ 12, 8 ],
      lineWidth: 1.5,
      cursor: 'pointer',
      tandem: tandem.createTandem( 'equilibriumLineNode' )
    } );
    line.mouseArea = line.localBounds.dilated( 10 );
    line.touchArea = line.localBounds.dilated( 10 );

    this.addChild( line );

    // @private
    this.centerX = modelViewTransform2.modelToViewX( spring.positionProperty.get().x );
    spring.equilibriumYPositionProperty.link( function( equilibriumPosition ) {
      self.centerY = modelViewTransform2.modelToViewY( equilibriumPosition );
    } );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'EquilibriumLineNode', EquilibriumLineNode );

  return inherit( Node, EquilibriumLineNode, {
    reset: function() {
      this.positionProperty.reset();
    }
  } );

} );